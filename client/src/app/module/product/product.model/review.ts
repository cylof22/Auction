export class Review {
  constructor(
    public id: number,
    public productId: string,
    public timestamp: Date,
    public user: string,
    public rating: number,
    public comment: string) {
  }
}
