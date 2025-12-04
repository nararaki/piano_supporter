import { client } from "@/lib/apiClient";
import { callApi } from "@/lib/apiResponse";
import type {
	Post,
	CreatePostData,
	PresignedUrlResponse,
} from "@piano_supporter/common/domains/post.ts";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import { err, ok } from "@piano_supporter/common/lib/error.ts";
import type { createPostData } from "@piano_supporter/common/commonResponseType/honoResponse.ts";

/**
 * Presigned URLを取得
 */
const getPresignedUrl = async (
	fileName: string,
	contentType: string,
): Promise<Result<PresignedUrlResponse>> => {
	console.log("[getPresignedUrl] リクエスト開始", {
		fileName,
		contentType,
	});

	const result = await callApi<Result<PresignedUrlResponse>>(() =>
		client["posts"]["presigned-url"].$post({
			json: { fileName, contentType },
		}),
	);

	if (!result.ok) {
		console.error("[getPresignedUrl] エラーレスポンス", {
			error: result.error,
			errorType: result.error.type,
			errorMessage: result.error.message,
			fileName,
			contentType,
		});
		return result;
	}

	// レスポンスボディがResult型の場合、そのまま返す
	const response = result.value;
	if (!response.ok) {
		console.error("[getPresignedUrl] エラーレスポンス", {
			error: response.error,
			errorType: response.error.type,
			errorMessage: response.error.message,
			fullResponse: response,
		});
		return response;
	}

	console.log("[getPresignedUrl] 成功", {
		key: response.value.key,
		cloudFrontUrl: response.value.cloudFrontUrl,
	});

	return response;
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
		console.log("presignedUrl", presignedUrl);	
		console.log("[uploadFileToS3] アップロード開始", {
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type,
			presignedUrlLength: presignedUrl.length,
		});

		// アップロード進捗を監視
		xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable && onProgress) {
				const progress = Math.round((event.loaded / event.total) * 100);
				onProgress(progress);
			}
		});

		xhr.addEventListener("load", () => {
			console.log("[uploadFileToS3] レスポンス受信", {
				status: xhr.status,
				statusText: xhr.statusText,
				responseText: xhr.responseText,
				responseHeaders: xhr.getAllResponseHeaders(),
			});

			if (xhr.status === 200) {
				console.log("[uploadFileToS3] アップロード成功");
				resolve(ok(undefined));
			} else {
				console.error("[uploadFileToS3] アップロード失敗", {
					status: xhr.status,
					statusText: xhr.statusText,
					responseText: xhr.responseText,
					responseHeaders: xhr.getAllResponseHeaders(),
				});
				resolve(
					err({
						type: "FILE_UPLOAD_ERROR",
						message: `S3へのアップロードに失敗しました (Status: ${xhr.status} ${xhr.statusText})`,
					}),
				);
			}
		});

		xhr.addEventListener("error", (event) => {
			console.error("[uploadFileToS3] ネットワークエラー", {
				event,
				fileName: file.name,
				fileSize: file.size,
				presignedUrl: presignedUrl.substring(0, 100) + "...",
			});
			resolve(
				err({
					type: "FILE_UPLOAD_ERROR",
					message: "S3へのアップロード中にネットワークエラーが発生しました",
				}),
			);
		});

		xhr.addEventListener("abort", () => {
			console.warn("[uploadFileToS3] アップロードキャンセル");
			resolve(
				err({
					type: "FILE_UPLOAD_ERROR",
					message: "アップロードがキャンセルされました",
				}),
			);
		});

		xhr.addEventListener("timeout", () => {
			console.error("[uploadFileToS3] タイムアウト", {
				timeout: xhr.timeout,
			});
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
			console.error("[uploadFileToS3] リクエスト送信エラー", {
				error,
				errorType: error instanceof Error ? error.constructor.name : typeof error,
				errorMessage: error instanceof Error ? error.message : String(error),
				errorStack: error instanceof Error ? error.stack : undefined,
			});
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
		console.log("[uploadVideoToS3] 開始", {
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type,
		});

		// 1. Presigned URLを取得
		const presignedUrlResult = await getPresignedUrl(file.name, file.type);

		if (!presignedUrlResult.ok) {
			console.error("[uploadVideoToS3] Presigned URL取得失敗", {
				error: presignedUrlResult.error,
				errorType: presignedUrlResult.error.type,
				errorMessage: presignedUrlResult.error.message,
				fileName: file.name,
				fileType: file.type,
			});
			return err({
				type: "FILE_UPLOAD_ERROR",
				message: presignedUrlResult.error.message,
			});
		}

		const { presignedUrl, cloudFrontUrl } = presignedUrlResult.value;

		console.log("[uploadVideoToS3] Presigned URL取得成功", {
			key: presignedUrlResult.value.key,
			cloudFrontUrl,
		});

		// 2. Presigned URLを使ってS3に直接アップロード
		const uploadResult = await uploadFileToS3(file, presignedUrl, onProgress);

		if (!uploadResult.ok) {
			console.error("[uploadVideoToS3] S3アップロード失敗", {
				error: uploadResult.error,
				errorType: uploadResult.error.type,
				errorMessage: uploadResult.error.message,
				fileName: file.name,
				fileSize: file.size,
			});
			return uploadResult;
		}

		console.log("[uploadVideoToS3] アップロード成功", {
			cloudFrontUrl,
		});

		// 3. CloudFrontのURLを返す
		return ok(cloudFrontUrl);
	} catch (error) {
		console.error("[uploadVideoToS3] 例外発生", {
			error,
			errorType: error instanceof Error ? error.constructor.name : typeof error,
			errorMessage: error instanceof Error ? error.message : String(error),
			errorStack: error instanceof Error ? error.stack : undefined,
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type,
		});
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
	data: CreatePostData & { videoFile?: File },
	onProgress?: (progress: number) => void,
): Promise<Result<Post>> => {
	try {
		let videoUrl: string | undefined;

		console.log("[createPost] 開始", {
			accountId: data.accountId,
			title: data.title,
			hasVideoFile: !!data.videoFile,
			hasVideoUrl: !!data.videoUrl,
		});

		// ビデオファイルが指定されている場合はS3にアップロード
		if (data.videoFile) {
			const uploadResult = await uploadVideoToS3(data.videoFile, onProgress);

			if (!uploadResult.ok) {
				console.error("[createPost] ビデオアップロード失敗", {
					error: uploadResult.error,
					errorType: uploadResult.error.type,
					errorMessage: uploadResult.error.message,
					fileName: data.videoFile.name,
					fileSize: data.videoFile.size,
				});
				return uploadResult;
			}

			videoUrl = uploadResult.value;
			console.log("[createPost] ビデオアップロード成功", { videoUrl });
		}

		// 投稿を作成
		const postData: {
			accountId: string;
			title: string;
			content: string;
			videoUrl?: string;
		} = {
			accountId: data.accountId,
			title: data.title,
			content: data.content,
		};

		// videoUrlが存在する場合のみ追加
		const finalVideoUrl = videoUrl || data.videoUrl;
		if (finalVideoUrl) {
			postData.videoUrl = finalVideoUrl;
		}

		console.log("[createPost] 投稿作成リクエスト送信", {
			accountId: postData.accountId,
			title: postData.title,
			hasVideoUrl: !!postData.videoUrl,
		});

		const result = await callApi<Result<Post>>(async() =>
			await client["posts"].$post({
				json: postData as createPostData,
			}),
		);

		if (!result.ok) {
			console.error("[createPost] 投稿作成失敗", {
				error: result.error,
				errorType: result.error.type,
				errorMessage: result.error.message,
				requestData: postData,
			});
			return result;
		}

		const response = result.value;
		if (!response.ok) {
			console.error("[createPost] 投稿作成失敗", {
				error: response.error,
				errorType: response.error.type,
				errorMessage: response.error.message,
				fullResponse: response,
				requestData: postData,
			});
			return response;
		}

		console.log("[createPost] 投稿作成成功", {
			postId: response.value.id,
		});

		return response;
	} catch (error) {
		console.error("[createPost] 例外発生", {
			error,
			errorType: error instanceof Error ? error.constructor.name : typeof error,
			errorMessage: error instanceof Error ? error.message : String(error),
			errorStack: error instanceof Error ? error.stack : undefined,
			requestData: {
				accountId: data.accountId,
				title: data.title,
				hasVideoFile: !!data.videoFile,
			},
		});
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

