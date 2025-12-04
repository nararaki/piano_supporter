export interface Post {
	id: string;
	accountId: string;
	title: string;
	content: string;
	video: Video | null;
	createdAt: Date;
	updatedAt: Date | null;
	//後々追加musicId: string;
}

export interface Video {
	id: string;
	postId: string;
	url: string;
	type: string | null;
	createdAt: Date;
	updatedAt: Date | null;
}

export interface CreatePostData {
	accountId: string;
	title: string;
	content: string;
	videoUrl?: string;
}

export interface PresignedUrlResponse {
	presignedUrl: string;
	key: string;
	cloudFrontUrl: string;
}