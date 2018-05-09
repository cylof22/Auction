import { Component, Input } from '@angular/core';

import { Order, OrderState, OrderEvent } from './../order.model/order'
import { OrderService } from './../service/order.service'

// product related is ony for test
import { ProductService } from './../../product/service/product.service';
import { Product } from './../../product/product.model/product';

@Component({
  selector: 'order-buyer-page',
  styleUrls: [ './order.buyer.component.css' ],
  templateUrl: './order.buyer.component.html'
})

export class OrderBuyerComponent {
  @Input("username") username: string;
  orders: Order[];
  currentType: OrderState[];
  activeOrderId: string;
  activeOrderEventType: OrderEvent;

  constructor(private productService: ProductService,
              private orderService: OrderService) {
    this.currentType = [OrderState.auction];
    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  ngOnInit() {
/*     this.orderService.getOrders(this.username).subscribe(
      res => this.orders = res
    ); */
    
    // test showing for this page
    //this.test();
  }

  test() {
    let searchParas = {
      "owner":this.username,
    } 

    this.productService.search(searchParas).subscribe(
      params => {
        this.orders = new Array<Order>();
        for (let i = 0; i < params.length; i++) {
          let product = params[i];
          if (product.url == "") {
            continue;
          }

            let test = new Order('', '', 0, '2018-05-05 11:22:32', '', '', '');

            test.id = (i + 70241740609).toString() ;
            test.state = i % 7 + 1;

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

  onClickAuction(auction, unshipped, dispatched, inreturn) {
    this.currentType = [OrderState.auction];

    auction['active'] = 'true';
    unshipped['active'] = 'false';
    dispatched['active'] = 'false';
    inreturn['active'] = 'false';
  }

  onClickUnshipped(auction, unshipped, dispatched, inreturn) {
    this.currentType = [OrderState.unshipped];

    auction['active'] = 'false';
    unshipped['active'] = 'true';
    dispatched['active'] = 'false';
    inreturn['active'] = 'false';
  }

  onClickDispatched(auction, unshipped, dispatched, inreturn) {
    this.currentType = [OrderState.dispatched];

    auction['active'] = 'false';
    unshipped['active'] = 'false';
    dispatched['active'] = 'true';
    inreturn['active'] = 'false';
  }

  onClickReturn(auction, unshipped, dispatched, inreturn) {
    this.currentType = [OrderState.returnInAgree,
                        OrderState.returnAgreed,
                        OrderState.returnReturned,
                        OrderState.returnCompleted];

    auction['active'] = 'false';
    unshipped['active'] = 'false';
    dispatched['active'] = 'false';
    inreturn['active'] = 'true';
  }

  handleOrderEvent(date) {
    if ( !(date.hasOwnProperty('id') && date.hasOwnProperty('type')) ) {
      return;
    }

    let orderId = date['id'];
    this.activeOrderEventType = date['type'];
    switch (this.activeOrderEventType) {
      case OrderEvent.cancelOrder:
      this.onCancelOrder(orderId);
      break;
      case OrderEvent.uploadReturnExpress:
      this.onShipReturn(orderId);
      break;
    }
  }

  onCancelOrder(orderId) {
    this.activeOrderId = orderId;
  }

  onShipReturn(orderId) {
    this.activeOrderId = orderId;
  }

  applyOrderCancel() {
    let cancelInfoCtrl = <HTMLTextAreaElement>(document.getElementById("cancelInfo"));
    let cancelOrderInfo = {
      "id": this.activeOrderId,
      'info': cancelInfoCtrl.value
    }
    this.orderService.cancelOrderByBuyer(cancelOrderInfo);

    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  endOrderCancel() {
    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  submitReturnExpress() {
    let expressIdCtrl = <HTMLInputElement>document.getElementById("expressId");
    let courierCtrl = <HTMLInputElement>document.getElementById("courier");

    let expressInfo = {
      "id": this.activeOrderId,
      'courier': courierCtrl.value,
      'expressId': expressIdCtrl.value
    }
    this.orderService.shipReturnByBuyer(this.activeOrderId, expressInfo);

    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  cancelReturnExpress() {
    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }
}

