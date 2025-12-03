import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { err, ok, type Result } from "@piano_supporter/common/lib/error.ts";
import type { PresignedUrlResponse } from "@piano_supporter/common/domains/post.ts";
import { randomUUID } from "crypto";

export class S3PresignedUrlGenerator {
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
		this.bucketName = process.env.AWS_S3_BUCKET_NAME || "";
		this.cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN || "";
	}
	async generatePresignedUrl(
		fileName: string,
		contentType: string,
	): Promise<Result<PresignedUrlResponse>> {
		try {
			console.log("[generatePresignedUrl] 開始", {
				fileName,
				contentType,
				cloudFrontDomain: this.cloudFrontDomain,
				bucketName: this.bucketName,
				region: process.env.AWS_REGION,
				hasAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
				hasSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				hasBucketName: process.env.AWS_S3_BUCKET_NAME,
				hasCloudFrontDomain: process.env.AWS_CLOUDFRONT_DOMAIN,
			});



			// 環境変数の検証
			if (!this.bucketName) {
				console.error("[generatePresignedUrl] バケット名が設定されていません");
				return err({
					type: "FILE_UPLOAD_ERROR",
					message: "AWS_S3_BUCKET_NAMEが設定されていません",
				});
			}

			if (!this.cloudFrontDomain) {
				console.error("[generatePresignedUrl] CloudFrontドメインが設定されていません");
				return err({
					type: "FILE_UPLOAD_ERROR",
					message: "AWS_CLOUDFRONT_DOMAINが設定されていません",
				});
			}

			// ファイル名を安全にする（UUID + 元の拡張子）
			const fileExtension = fileName.split(".").pop() || "mp4";
			const key = `videos/${randomUUID()}.${fileExtension}`;

			const command = new PutObjectCommand({
				Bucket: this.bucketName,
				Key: key,
				ContentType: contentType,
			});

			console.log("[generatePresignedUrl] PutObjectCommand作成", {
				bucket: this.bucketName,
				key,
				contentType,
			});

			// Presigned URLを生成（15分間有効）
			const presignedUrl = await getSignedUrl(this.s3Client, command, {
				expiresIn: 900, // 15分
			});

			// CloudFrontのURLを構築
			const cloudFrontUrl = `https://${this.cloudFrontDomain}/${key}`;

			console.log("[generatePresignedUrl] 成功", {
				key,
				cloudFrontUrl,
				presignedUrlLength: presignedUrl.length,
			});

			return ok({
				presignedUrl,
				key,
				cloudFrontUrl,
			});
		} catch (error) {
			console.error("[generatePresignedUrl] エラー発生", {
				error,
				errorType: error instanceof Error ? error.constructor.name : typeof error,
				errorMessage: error instanceof Error ? error.message : String(error),
				errorStack: error instanceof Error ? error.stack : undefined,
				fileName,
				contentType,
				envVars: {
					AWS_REGION: process.env.AWS_REGION,
					hasAccessKeyId: !!process.env.AWS_ACCESS_KEY_ID,
					hasSecretAccessKey: !!process.env.AWS_SECRET_ACCESS_KEY,
					AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
					AWS_CLOUDFRONT_DOMAIN: process.env.AWS_CLOUDFRONT_DOMAIN,
				},
			});
			return err({
				type: "FILE_UPLOAD_ERROR",
				message: `Presigned URLの生成に失敗しました: ${error instanceof Error ? error.message : "Unknown error"}`,
			});
		}
	}
}

export const newS3PresignedUrlGenerator = new S3PresignedUrlGenerator();

