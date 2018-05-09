export enum OrderState {
    none,
    auction,
    unshipped,              // product isn't shipped
    dispatched,             // product is shipped
    returnInAgree,          // waiting for agreeing from seller
    returnAgreed,           // this return is agreed by seller
    returnReturned,         // product is returned by buyer
    returnCompleted,        // seller receives returned product
  }
  
  export class Order {
    constructor(
      public id: string,
      public price: string,
      public state: OrderState,
      public time: string,
      public productId: string,
      public productUrl: string,
      public express: string,
    ) {
    }
  }

  export enum OrderEvent {
    none,
    cancelOrder,
    uploadOrderExpress,
    uploadReturnExpress,
  }