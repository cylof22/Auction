export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public description: string,
    public url: string,
    public categories: Array<string>) {
  }
}
