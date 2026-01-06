import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import fs from "node:fs/promises";
import path from "node:path";

export class S3XmlUploader {
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
	 * XMLファイルをS3にアップロード
	 * @param filePath アップロードするXMLファイルのパス
	 * @param musicId musicのID
	 * @param fileName S3に保存するファイル名（省略時は元のファイル名を使用）
	 * @returns S3のURL
	 */
	async uploadXmlFile(
		filePath: string,
		musicId: string,
		fileName?: string,
	): Promise<Result<string>> {
		try {
			// 環境変数の検証
			if (!this.bucketName) {
				return err({
					type: "FILE_UPLOAD_ERROR",
					message: "AWS_S3_BUCKET_NAMEが設定されていません",
				});
			}

			if (!this.cloudFrontDomain) {
				return err({
					type: "FILE_UPLOAD_ERROR",
					message: "AWS_CLOUDFRONT_DOMAINが設定されていません",
				});
			}

			// ファイルを読み込む
			const fileContent = await fs.readFile(filePath);
			const originalFileName = fileName || path.basename(filePath);
			
			// S3のキーを生成（musicid/ファイル名.xml）
			const key = `original/${musicId}/${originalFileName}`;

			// S3にアップロード
			const command = new PutObjectCommand({
				Bucket: this.bucketName,
				Key: key,
				Body: fileContent,
				ContentType: "application/xml",
			});

			await this.s3Client.send(command);

			// CloudFrontのURLを構築
			const cloudFrontUrl = `https://${this.cloudFrontDomain}/${key}`;

			console.log(`[uploadXmlFile] アップロード成功: ${key} -> ${cloudFrontUrl}`);

			return ok(cloudFrontUrl);
		} catch (error) {
			console.error("[uploadXmlFile] エラー発生", {
				error,
				errorMessage: error instanceof Error ? error.message : String(error),
				filePath,
				musicId,
			});
			return err({
				type: "FILE_UPLOAD_ERROR",
				message: `XMLファイルのアップロードに失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`,
			});
		}
	}
}

export const newS3XmlUploader = new S3XmlUploader();

