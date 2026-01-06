import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";

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

	/**
	 * CloudFrontのURLからコンテンツを取得
	 * @param cloudFrontUrl CloudFrontのURL（例: "https://cloudfront-domain/original/musicId/file.xml"）
	 * @returns コンテンツのBuffer
	 */
	async get(cloudFrontUrl: string): Promise<Result<Buffer>> {
		try {
			// CloudFrontのURLに対してHTTPリクエストを送信
			const response = await fetch(cloudFrontUrl);

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
	 * @returns CloudFrontのURL
	 */
	async put(
		key: string,
		content: Buffer,
		contentType: string,
	): Promise<Result<string>> {
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
			});

			await this.s3Client.send(command);

			// CloudFrontのURLを構築
			const cloudFrontUrl = `https://${this.cloudFrontDomain}/${key}`;

			console.log(`[put] アップロード成功: ${key} -> ${cloudFrontUrl}`);

			return ok(cloudFrontUrl);
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
}

export const newMediaStorage = new MediaStorage();

