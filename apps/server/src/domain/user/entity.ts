export type User = {
    id:string;
    userName:string;
    email:string;
}

export class UserEntity {
    constructor(
        public id:string,
        public userName:string,
        public email:string,
    ){}
}