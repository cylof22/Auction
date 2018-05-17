import { Component, Input } from '@angular/core';

import { Order, OrderState, OrderEvent } from './../order.model/order'
import { OrderService } from './../service/order.service'

// product related is ony for test
import { ProductService } from './../../product/service/product.service';
import { Product } from './../../product/product.model/product';

@Component({
  selector: 'order-seller-page',
  styleUrls: [ './order.seller.component.css' ],
  templateUrl: './order.seller.component.html'
})


export class OrderSellerComponent {
  @Input("username") username: string;
  orders: Order[];
  currentType: OrderState[];

  activeOrderId: string;
  activeOrderEventType: OrderEvent;

  constructor(private productService: ProductService,
              private orderService: OrderService) {
    this.currentType = [OrderState.unshipped];
  }

  ngOnInit() {
/*     this.orderService.getCancelledOrders(this.username).subscribe(
      res => this.orders = res
    ); */
    
    // test showing for this page
    //this.test();
  }

  test() {
    this.productService.getProductsByUser(this.username).subscribe(
      params => {
        this.orders = new Array<Order>();
        for (let i = 0; i < params.length; i++) {
          let product = params[i];
          if (product.url == "") {
            continue;
          }

            let test = new Order('', '', 0, '2018-05-05 11:22:32', '', '', '');

            test.id = (i + 70241740609).toString() ;
            test.state = i % 6 + 1;

            test.price = product.price.value;
            if (test.price == '') {
              test.price = '2868';
            }
            test.productId = product.id;
            test.productUrl = product.url;
            this.orders.push(test);
        }
      }
    )
  }

  onClickUnshipped(unshipped, inreturn) {
    this.currentType = [OrderState.unshipped];

    unshipped['active'] = 'true';
    inreturn['active'] = 'false';
  }

  onClickInReturn(unshipped, inreturn) {
    this.currentType = [OrderState.returnInAgree, 
                        OrderState.returnAgreed, 
                        OrderState.returnReturned];

    unshipped['active'] = 'false';
    inreturn['active'] = 'true';
  }

  handleOrderEvent(date) {
    if ( !(date.hasOwnProperty('id') && date.hasOwnProperty('type')) ) {
      return;
    }

    let orderId = date['id'];
    this.activeOrderEventType = date['type'];
    switch (this.activeOrderEventType) {
      case OrderEvent.uploadOrderExpress:
      this.onUploadExpress(orderId);
      break;
    }
  }

  onUploadExpress(orderId) {
    this.activeOrderId = orderId;
  }

  submitExpress() {
    let expressIdCtrl = <HTMLInputElement>document.getElementById("dispatchId");
    let courierCtrl = <HTMLInputElement>document.getElementById("courier");

    let expressInfo = {
      "id": this.activeOrderId,
      'courier': courierCtrl.value,
      'expressId': expressIdCtrl.value
    }
    this.orderService.shipProductBySeller(this.activeOrderId, expressInfo);

    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  cancelExpress() {
    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }
}

