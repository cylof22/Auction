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

  export class User {
    constructor(
      public username: string,
      public id: string,
      public token: string){
      }
  }

  export class UserInfo {
    constructor(
      public username: string,
      public phone: string,
      public email: string,
      public amount: string,
      public address: string,
      public concernedUsers: Array<string>){
      }
  }

