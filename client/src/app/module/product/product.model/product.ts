export class Product {
  constructor(
    public id: string,
    public owner: string,
    public maker: string,
    public price: ProductPrice,
    public rating: number,
    public url: string,
    public styleImgUrl: string,
    public tags: Array<string>,
    public story: ProductStory,
    public type: string,              // digit(0) and entity(1)
    public chainId: string) {
  }
}

export class BatchProducts {
  constructor(
    public datas: Array<string>,
    public tags: Array<string>,
    public owner: string,
    public maker: string,
    public type: string,
    public price: ProductPrice
  ) {
  }
}

export class UploadProduct {
  constructor(
    public picData: string,
    public styleUrl: string,
    public tags: Array<string>,
    public owner: string,
    public maker: string,
    public story: ProductStory,
    public type: string,
    public price: ProductPrice
  ) {
  }
}

export class ProductStory {
  constructor(
    public description: string,
    public pictures: Array<string>
  ) {
  }
}

export class ProductPrice {
  constructor(
    public type: string,
    public value: string,
    public duration: string,
  ) {
  }
}

export enum EPriceType {
  Fix,
  Auction,
  OnlyShow
};

export enum EProdcutType {
  Digit,
  Entity
}
