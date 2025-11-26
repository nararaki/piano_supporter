export interface Post {
	id: string;
	description: string;
	videoUrl: string;
	musicId: string;
	accountId: string;
	createdAt: Date;
	updatedAt: Date | null;
}

export interface mockPot{
	id: string;
	accountId: string;
	title: string;
	content: string;
}