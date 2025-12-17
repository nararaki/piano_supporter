import { client } from "@/infrastructure/api/apiClient";
import { callApi } from "@/infrastructure/api/apiResponse";
import type {
	Post,
	CreatePostData,
	PresignedUrlResponse,
} from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { err, ok } from "@piano_supporter/common/lib/error.ts";
import type { createPostData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";

/**
 * Presigned URLを取得
 */
const getPresignedUrl = async (
	fileName: string,
	contentType: string,
): Promise<Result<PresignedUrlResponse>> => {
	const result = await callApi<PresignedUrlResponse>(() =>
		client["posts"]["presigned-url"].$post({
			json: { fileName, contentType },
		}),
	);

	return result;
};

/**
 * S3にファイルを直接アップロード
 */
const uploadFileToS3 = async (
	file: File,
	presignedUrl: string,
	onProgress?: (progress: number) => void,
): Promise<Result<void>> => {
	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		// アップロード進捗を監視
		xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable && onProgress) {
				const progress = Math.round((event.loaded / event.total) * 100);
				onProgress(progress);
			}
		});

		xhr.addEventListener("load", () => {
		if (xhr.status === 200) {
				resolve(ok(undefined));
			} else {
				resolve(
					err({
						type: "FILE_UPLOAD_ERROR",
						message: `S3へのアップロードに失敗しました (Status: ${xhr.status} ${xhr.statusText})`,
					}),
				);
			}
		});

		xhr.addEventListener("error", (event) => {
			resolve(
				err({
					type: "FILE_UPLOAD_ERROR",
					message: "S3へのアップロード中にネットワークエラーが発生しました",
				}),
			);
		});

		xhr.addEventListener("abort", () => {
			resolve(
				err({
					type: "FILE_UPLOAD_ERROR",
					message: "アップロードがキャンセルされました",
				}),
			);
		});

		xhr.addEventListener("timeout", () => {
			resolve(
				err({
					type: "FILE_UPLOAD_ERROR",
					message: "アップロードがタイムアウトしました",
				}),
			);
		});

		// PUTリクエストでファイルをアップロード
		try {
			xhr.open("PUT", presignedUrl, true);
			xhr.setRequestHeader("Content-Type", file.type);
			xhr.timeout = 300000; // 5分のタイムアウト
			xhr.send(file);
		} catch (error) {
			resolve(
				err({
					type: "FILE_UPLOAD_ERROR",
					message: `リクエストの送信に失敗しました: ${
						error instanceof Error ? error.message : "Unknown error"
					}`,
				}),
			);
		}
	});
};

/**
 * ビデオをS3にアップロードしてCloudFrontのURLを取得
 */
const uploadVideoToS3 = async (
	file: File,
	onProgress?: (progress: number) => void,
): Promise<Result<string>> => {
	try {
		// 1. Presigned URLを取得
		const presignedUrlResult = await getPresignedUrl(file.name, file.type);

		if (!presignedUrlResult.ok) {
			return err({
				type: "FILE_UPLOAD_ERROR",
				message: presignedUrlResult.error.message,
			});
		}

		const { presignedUrl, cloudFrontUrl } = presignedUrlResult.value;

		// 2. Presigned URLを使ってS3に直接アップロード
		const uploadResult = await uploadFileToS3(file, presignedUrl, onProgress);

		if (!uploadResult.ok) {
			return uploadResult;
		}

		// 3. CloudFrontのURLを返す
		return ok(cloudFrontUrl);
	} catch (error) {
		return err({
			type: "FILE_UPLOAD_ERROR",
			message: `動画のアップロードに失敗しました: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		});
	}
};

/**
 * 投稿を作成（ビデオアップロードを含む）
 */
export const createPost = async (
	data: Omit<CreatePostData, "videoUrl" | "videoType"> & { videoFile: File },
	onProgress?: (progress: number) => void,
): Promise<Result<Post>> => {
	try {
		// ビデオファイルをS3にアップロード
		const videoType = data.videoFile.type;
		const uploadResult = await uploadVideoToS3(data.videoFile, onProgress);

		if (!uploadResult.ok) {
			return uploadResult;
		}

		const videoUrl = uploadResult.value;

		// 投稿を作成
		const postData: {
			accountId: string;
			title: string;
			content: string;
			videoUrl: string;
			videoType: string;
		} = {
			accountId: data.accountId,
			title: data.title,
			content: data.content,
			videoUrl: videoUrl,
			videoType: videoType,
		};

		const result = await callApi<Post>(async() =>
			await client["posts"].$post({
				json: postData as createPostData,
			}),
		);

		return result;
	} catch (error) {
		return {
			ok: false,
			error: {
				type: "UNEXPECTED",
				message:
					error instanceof Error ? error.message : "投稿の作成に失敗しました",
			},
		};
	}
};

