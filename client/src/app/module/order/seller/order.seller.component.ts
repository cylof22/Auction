import { Component, Input } from '@angular/core';

import { Order, OrderStatus, OrderEvent, Express } from './../order.model/order'
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
  currentType: string[];
  failedValue: string;

  activeOrderId: string;
  activeOrderEventType: OrderEvent;

  constructor(private productService: ProductService,
              private orderService: OrderService) {
    this.currentType = [OrderStatus.none.toString()];
    this.failedValue = '';
  }

  ngOnInit() {
    this.orderService.getMySellings(this.username).subscribe(
      orders => this.orders = orders
    )
  }

  onClickNoBuyer(nobuyer, auction, unshipped, inreturn) {
    this.currentType = [OrderStatus.none.toString()];

    nobuyer['active'] = 'true';
    auction['active'] = 'false';
    unshipped['active'] = 'false';
    inreturn['active'] = 'false';
  }

  onClickAuction(nobuyer, auction, unshipped, inreturn) {
    this.currentType = [OrderStatus.inAuction.toString()];

    nobuyer['active'] = 'false';
    auction['active'] = 'true';
    unshipped['active'] = 'false';
    inreturn['active'] = 'false';
  }

  onClickUnshipped(nobuyer, auction, unshipped, inreturn) {
    this.currentType = [OrderStatus.unshipped.toString()];

    nobuyer['active'] = 'false';
    auction['active'] = 'false';
    unshipped['active'] = 'true';
    inreturn['active'] = 'false';
  }

  onClickInReturn(nobuyer, auction, unshipped, inreturn) {
    this.currentType = [OrderStatus.returnInAgree.toString(), 
                        OrderStatus.returnAgreed.toString(), 
                        OrderStatus.returnDispatched.toString()];

    nobuyer['active'] = 'false';
    auction['active'] = 'false';
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
      this.uploadProductExpress(orderId);
      break;
      case OrderEvent.cancelOrderBySeller:
      this.cancelOrderBySeller(orderId);
      break;
      case OrderEvent.agreeReturn:
      this.agreeReturn(orderId);
      break;
      case OrderEvent.confirmReturn:
      this.confirmReturn(orderId);
      break;
    }
  }

  uploadProductExpress(orderId) {
    this.activeOrderId = orderId;
  }

  submitExpress() {
    let expressIdCtrl = <HTMLInputElement>document.getElementById('express');
    let courierCtrl = <HTMLInputElement>document.getElementById('courier');

    let expressInfo = new Express(courierCtrl.value, expressIdCtrl.value, '');
    this.orderService.shipProductBySeller(this.activeOrderId, expressInfo).subscribe(
      result => this.handleRequestResult(result)
    )

    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  cancelExpress() {
    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  cancelOrderBySeller(orderId: string) {
    this.orderService.cancelOrderBySeller(orderId).subscribe(
      result => this.handleRequestResult(result)
    );
  }

  agreeReturn(orderId: string) {
    this.orderService.agreeReturnBySeller(orderId).subscribe(
      result => this.handleRequestResult(result)
    );
  }

  confirmReturn(orderId: string) {
    this.orderService.confirmReturnBySeller(orderId).subscribe(
      result => this.handleRequestResult(result)
    );
  }

  handleRequestResult(error: any) {
    if (error == null) {
      location.reload(true);
    } else {
      if (error.hasOwnProperty('error')) {
        this.failedValue = error['error'];
      }
    }
  }
}

