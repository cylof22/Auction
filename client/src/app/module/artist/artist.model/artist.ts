export class Artist {
    constructor(
      public name: string,
      public field: Array<string>,
      public masterpieceURL: string,
      public modelName: string,
      public artmovement: Array<string>) {
    }
  }