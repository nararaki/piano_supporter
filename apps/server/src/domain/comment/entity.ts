export type CommentData = {
    id:string;
    userID: string;
    content:string;
    createdAt: Date;
    sectionNumber: number;
    replyIds: string[];
}

export class CommentEntity {
    constructor(
        public id:string,
        public userID: string,
        public content:string,
        public createdAt: Date,
        public sectionNumber: number,
        public replyIds: string[],
    ){}
}