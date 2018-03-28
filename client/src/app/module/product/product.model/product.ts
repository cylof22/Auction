export class Product {
  constructor(
    public id: number,
    public title: string,
    public owner: string,
    public creator: string,
    public price: number,
    public rating: number,
    public description: string,
    public url: string,
    public styleImgUrl: string,
    public categories: Array<string>) {
  }
}
