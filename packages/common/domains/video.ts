export type VideoData = {
	id: string;
	postId: string;
	url: string;
};

export class VideoEntity {
	constructor(
		public id: string,
		public postId: string,
		public url: string,
	) {}
}

