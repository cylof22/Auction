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

  export class ProductInfo {
    constructor(
      public id: string,
      public owner: string,
      public url: string,
      public type: string,
      public priceType: string,
      public priceValue: string,
    ){
    }
  }

  export class SellInfo {
    constructor(
      public product: ProductInfo,
      public startTime: string,            // start time when selling
      public duration: string,             // valid time for the order
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
      public product: ProductInfo,
      public chainId: string,
      public status: string,
      public startTime: string,            // start time when selling
      public serverStartTime: string,
      public duration: string,             // valid time for the order
      public express: Express,
      public returnInfo: ReturnInfo,
      public buyInfo: BuyInfo,
      public completeTime: string,
    ) {
    }
  }

  export class Express {
    constructor(
      public company: string,
      public number: string,
      public startTime: string      // server will save this value so needn't pass it
    ){
    }
  }

  export class ReturnInfo {
    constructor(
      public description: string,
      public images: Array<string>,
      public askTime: string,         // the following three time parameters are from server
      public agreeTime: string,
      public confirmTime: string,
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