/**
 * ファイルアップロード関連の定数
 */

/**
 * 動画ファイルの最大サイズ（バイト）
 * 500MB
 */
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

/**
 * 画像ファイルの最大サイズ（バイト）
 * 100MB
 */
export const MAX_IMAGE_SIZE = 100 * 1024 * 1024;

/**
 * 許可された動画ファイルのMIMEタイプ
 */
export const ALLOWED_VIDEO_TYPES = [
	"video/mp4",
	"video/webm",
	"video/mov",
	"video/avi",
	"video/quicktime",
] as const;

/**
 * 許可された画像ファイルのMIMEタイプ
 */
export const ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
] as const;

