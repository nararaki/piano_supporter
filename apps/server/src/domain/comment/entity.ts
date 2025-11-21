export interface Comment {
	id: number;
	userId: string;
	content: string;
	createdAt: Date;
	sectionNumber: number;
	timing: number;
	parentId: number | null; //commentのid
	postId: number;
}
