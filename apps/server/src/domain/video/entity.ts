export type VideoData = {
    id:number;
    postId:number;
    url:string;
}

export class VideoEntity {
    constructor(
        public id:number,
        public postId:number,
        public url:string,
    ){}
}