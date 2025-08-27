export type PostsData = {
    id:string;
    videoUrl:string;
    composerName:string;
    composerId:string;
    title:string;
    description:string;
    commentIds:string[];
    createdAt: Date;
}

export class PostsEntity {
    constructor(
        public id:string,
        public videoUrl:string,
        public composerName:string,
        public composerId:string,
        public title:string,
        public description:string,
        public commentIds:string[],
        public createdAt: Date,
    ){}
}