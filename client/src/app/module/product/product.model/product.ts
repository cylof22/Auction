export class Product {
  constructor(
    public id: string,
    public title: string,
    public owner: string,
    public creator: string,
    public price: number,
    public rating: number,
    public description: string,
    public url: string,
    public styleImgUrl: string,
    public categories: Array<string>,
    public picAuth: PicAuth,
    public status: ProductStatus) {
  }
}

export class PicAuth {
  constructor(
    public authFiles: Array<string>,
    public authDescrption: string,
    public isPublic: boolean){
  }
}

export enum ProductStatus {
  None,
  Sale,
}
