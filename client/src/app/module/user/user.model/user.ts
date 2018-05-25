// returned info after login
export class User {
  constructor(
    public username: string,
    public id: string,
    public token: string){
    }
}

export class ConcernedUser {
  constructor(
    public username: string,
    public headPortraitUrl: string,
    public productsNumber: string,
    public fansNumber: string,
    public shownProducts: Array<string>
  ) {
  }
}

export class UserInfo {
  constructor(
    public username: string,
    public headPortraitUrl: string,
    public phone: string,
    public email: string){
    }
}

export class Wallet {
  constructor(
    public amount: string,
    public address: string,
  ) {
  }
}

