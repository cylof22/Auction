 export enum OrderStatus {
    none,		
    inFix,	
    inAuction,
    unshipped,              // product isn't shipped
    dispatched,             // product is shipped
    dispatchConfirmed,      // buyer confirms transaction
    completed,			        // transaction is successful
    returnInAgree,          // waiting for agreeing from seller
    returnAgreed,           // this return is agreed by seller
    returnDispatched,       // product is returned by buyer
    returnConfirmed,        // seller receives returned product
    returnCompleted,        // return is completed
    failed                  // transaction fails
  }

  export class SellInfo {
    constructor(
      public productId: string,   
      public productOwner: string, 
      public productUrl: string,
      public productType: string,
      public startTime: string,            // start time when selling
      public duration: string,             // valid time for the order
      public priceValue: string,
      public priceType: string,
    ){
    }
  }

  export class BuyInfo {
    constructor(
      public buyer: string,
      public priceValue: string,
      public startTime: string,
    ){
    }
  }
  
  export class Order {
    constructor(
      public id: string,
      public chainId: string,
      public status: string,
      public productId: string,   
      public productOwner: string, 
      public productUrl: string,
      public productType: string,
      public priceType: string,
      public priceValue: string,
      public startTime: string,            // start time when selling
      public duration: string,             // valid time for the order
      public express: Express,
      public returnInfo: ReturnInfo,
      public buyInfo: BuyInfo,
    ) {
    }
  }

  export class Express {
    constructor(
      public company: string,
      public number: string,
    ){
    }
  }

  export class ReturnInfo {
    constructor(
      public description: string,
      public images: Array<string>,
      public express: Express,
    ) {
    }
  }

  // send event from order item to its parent
  export enum OrderEvent {
    none,
    cancelOrderBySeller,
    uploadOrderExpress,
    uploadReturnExpress,
    confirmOrderByBuyer,
    cancelOrderByBuyer,
    agreeReturn,
    confirmReturn,
  }