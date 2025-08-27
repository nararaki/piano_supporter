export type User = {
    id:string,
    userName:string,
    postIds:string[],
}

export class UserEntity {
    constructor(
        public id:string,
        public userName:string,
        public postIds:string[],
    ){}
}