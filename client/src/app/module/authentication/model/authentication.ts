export class RegisterInfo {
    constructor(
        public username: string,
        public password: string,
        public phone: string,
        public email: string) {
    }
}

export class LoginInfo {
    constructor(
        public username:string,
        public password:string,
        public temporary:boolean){
    }
}