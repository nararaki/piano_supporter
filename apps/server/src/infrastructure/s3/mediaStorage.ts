import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import type { Practice } from "@piano_supporter/common/domains/practice.ts";
import type { Music } from "@piano_supporter/common/domains/music.ts";

export class MediaStorage {
	private s3Client: S3Client;
	private bucketName: string;
	private cloudFrontDomain: string;

	constructor() {
		this.s3Client = new S3Client({
			region: process.env.AWS_REGION || "ap-northeast-1",
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
			},
			forcePathStyle: false,
		});
		this.bucketName = process.env.AWS_S3_SHEET_BUCKET_NAME || "";
		this.cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN || "";
	}

	public async createPracticeStorage(music: Music, practice: Practice): Promise<Result<string>> {
		const sheetMusic = await this.get(music.sheetMusicUrl);
		if (!sheetMusic.ok) {
			return err({
				type: "NOT_FOUND",
				message: "楽譜元データが見つかりません",
			});
		}

		const key = `practice/${practice.id}.xml`;
		const putResult = await this.put(key, sheetMusic.value, "application/xml");
		if (!putResult.ok) {
			return err({	
				type: "FILE_UPLOAD_ERROR",
				message: "シートミュージックのアップロードに失敗しました",
			});
		}
		const sheetMusicUrl = this.getCloudFrontUrl(key);
		return ok(sheetMusicUrl);
	}

	public async getXmlData(cloudFrontUrl: string): Promise<Result<Buffer>> {
		const bufferResult = await this.get(cloudFrontUrl);
		if (!bufferResult.ok) {
			return err({
				type: "NOT_FOUND",
				message: "コンテンツが見つかりません",
			});
		}
		return ok(bufferResult.value);
	}
	/**
	 * CloudFrontのURLからコンテンツを取得
	 * @param cloudFrontUrl CloudFrontのURL（例: "https://cloudfront-domain/original/musicId/file.xml"）
	 * @returns コンテンツのBuffer
	 */
	private async get(cloudFrontUrl: string): Promise<Result<Buffer>> {
		try {
			console.log("cloudFrontUrl", cloudFrontUrl);
			console.log("this.bucketName", this.bucketName);
			// CloudFrontのURLに対してHTTPリクエストを送信
			const response = await fetch(cloudFrontUrl);
			console.log("response", response);
			if (!response.ok) {
				if (response.status === 404) {
					return err({
						type: "NOT_FOUND",
						message: `コンテンツが見つかりません: ${cloudFrontUrl}`,
					});
				}
				return err({
					type: "FILE_UPLOAD_ERROR",
					message: `HTTPリクエストが失敗しました: ${response.status} ${response.statusText}`,
				});
			}

			// レスポンスをBufferに変換
			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			console.log(`[get] コンテンツ取得成功: ${cloudFrontUrl} (${buffer.length} bytes)`);

			return ok(buffer);
		} catch (error) {
			console.error("[get] エラー発生", {
				error,
				errorMessage: error instanceof Error ? error.message : String(error),
				cloudFrontUrl,
			});

			return err({
				type: "FILE_UPLOAD_ERROR",
				message: `CloudFrontからのコンテンツ取得に失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`,
			});
		}
	}

	/**
	 * S3にコンテンツをアップロード
	 * @param key S3オブジェクトのキー（例: "original/musicId/file.xml"）
	 * @param content アップロードするコンテンツ（Buffer）
	 * @param contentType コンテンツタイプ（例: "application/xml", "text/plain"）
	 * @returns 成功/失敗の結果
	 */
	async put(
		key: string,
		content: Buffer,
		contentType: string,
	): Promise<Result<void>> {
		try {
			// 環境変数の検証
			if (!this.bucketName) {
				return err({
					type: "FILE_UPLOAD_ERROR",
					message: "AWS_S3_SHEET_BUCKET_NAMEが設定されていません",
				});
			}

			if (!this.cloudFrontDomain) {
				return err({
					type: "FILE_UPLOAD_ERROR",
					message: "AWS_CLOUDFRONT_DOMAINが設定されていません",
				});
			}

			// コンテンツタイプが指定されていない場合は推測
			let finalContentType = contentType;
			if (!finalContentType) {
				// XMLファイルの場合はapplication/xml、それ以外はapplication/octet-stream
				finalContentType = key.endsWith(".xml")
					? "application/xml"
					: "application/octet-stream";
			}

			// S3にアップロード
			const command = new PutObjectCommand({
				Bucket: this.bucketName,
				Key: key,
				Body: content,
				ContentType: finalContentType,
				CacheControl: "no-cache",
			});

			await this.s3Client.send(command);

			const cloudFrontUrl = this.getCloudFrontUrl(key);
			console.log(`[put] アップロード成功: ${key} -> ${cloudFrontUrl}`);

			return ok(undefined);
		} catch (error) {
			console.error("[put] エラー発生", {
				error,
				errorMessage: error instanceof Error ? error.message : String(error),
				key,
			});
			return err({
				type: "FILE_UPLOAD_ERROR",
				message: `S3へのコンテンツアップロードに失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`,
			});
		}
	}

	/**
	 * S3キーからCloudFrontのURLを生成
	 * @param key S3オブジェクトのキー（例: "original/musicId/file.xml"）
	 * @returns CloudFrontのURL
	 */
	getCloudFrontUrl(key: string): string {
		return `https://${this.cloudFrontDomain}/${key}`;
	}

	/**
	 * CloudFrontのURLからS3キーを抽出
	 * @param cloudFrontUrl CloudFrontのURL（例: "https://cloudfront-domain/original/musicId/file.xml"）
	 * @returns S3キー（例: "original/musicId/file.xml"）、抽出できない場合はnull
	 */
	extractKeyFromUrl(cloudFrontUrl: string): string | null {
		try {
			const urlObj = new URL(cloudFrontUrl);
			// pathnameから先頭のスラッシュを削除
			const key = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;
			return key || null;
		} catch (error) {
			console.error("[extractKeyFromUrl] URL解析エラー", {
				error,
				cloudFrontUrl,
			});
			return null;
		}
	}
}

