import { uuidv7 } from "uuidv7";

export type Post =
	| PostWithoutVideo
	| PostWithVideo;

interface PostBase {
	id: string;
	accountSchoolRelationId: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

interface PostWithoutVideo extends PostBase {
	video: null;
}

interface PostWithVideo extends PostBase {
	video: Video;
}

export const createPostEntity = ({
	accountRelationId,
	title,
	content,
}: {
	accountRelationId: string;
	title: string;
	content: string;
}): PostWithoutVideo => {
	return {
		id: uuidv7(),
		accountSchoolRelationId: accountRelationId,
		title,
		content,
		video: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
};


export const attachVideo = (
	post: PostWithoutVideo,
	video: Video
): PostWithVideo => {
	return {
		...post,
		video,
		updatedAt: new Date(),
	};
};

export interface Video {
	id: string;
	postId: string;
	url: string;
	type: string;
	createdAt: Date;
	updatedAt: Date | null;
}

export const createVideoEntity = ({
	postId,
	url,
	type,
}: {
	postId: string;
	url: string;
	type: string;
}): Video => {
	return {
		id: uuidv7(),
		postId: postId,
		url: url,
		type: type,
		createdAt: new Date(),
		updatedAt: null,
	};
}

export interface CreatePostData {
	accountId: string;
	title: string;
	content: string;
	videoUrl: string;
	videoType: string;
}

export interface PresignedUrlResponse {
	presignedUrl: string;
	key: string;
	cloudFrontUrl: string;
}