import { Component, Input } from '@angular/core';

import { Order, OrderStatus, OrderEvent, Express } from './../order.model/order'
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
  currentType: string[];
  activeOrderId: string;
  failedValue: string;
  activeOrderEventType: OrderEvent;

  constructor(private productService: ProductService,
              private orderService: OrderService) {
    this.currentType = [OrderStatus.inAuction.toString()];
    this.activeOrderId = '';
    this.failedValue = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  ngOnInit() {
    this.orderService.getMyOrders(this.username).subscribe(
      res => this.orders = res
    );
  }

  onClickAuction(auction, unshipped, dispatched, inreturn) {
    this.currentType = [OrderStatus.inAuction.toString()];

    auction['active'] = 'true';
    unshipped['active'] = 'false';
    dispatched['active'] = 'false';
    inreturn['active'] = 'false';
  }

  onClickUnshipped(auction, unshipped, dispatched, inreturn) {
    this.currentType = [OrderStatus.unshipped.toString()];

    auction['active'] = 'false';
    unshipped['active'] = 'true';
    dispatched['active'] = 'false';
    inreturn['active'] = 'false';
  }

  onClickDispatched(auction, unshipped, dispatched, inreturn) {
    this.currentType = [OrderStatus.dispatched.toString()];

    auction['active'] = 'false';
    unshipped['active'] = 'false';
    dispatched['active'] = 'true';
    inreturn['active'] = 'false';
  }

  onClickReturn(auction, unshipped, dispatched, inreturn) {
    this.currentType = [OrderStatus.returnInAgree.toString(),
                        OrderStatus.returnAgreed.toString(),
                        OrderStatus.returnDispatched.toString()];

    auction['active'] = 'false';
    unshipped['active'] = 'false';
    dispatched['active'] = 'false';
    inreturn['active'] = 'true';
  }

  // onClickOthers(others) {
  //   this.currentType = [OrderStatus.inFix.toString(),
  //                       OrderStatus.dispatchConfirmed.toString(),
  //                       OrderStatus.returnConfirmed.toString()];
  // }

  handleOrderEvent(date) {
    if ( !(date.hasOwnProperty('id') && date.hasOwnProperty('type')) ) {
      return;
    }

    let orderId = date['id'];
    this.activeOrderEventType = date['type'];
    switch (this.activeOrderEventType) {
      case OrderEvent.cancelOrderByBuyer:
      this.onCancelOrder(orderId);
      break;
      case OrderEvent.confirmOrderByBuyer:
      this.confirmOrder(orderId);
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
      'description': cancelInfoCtrl.value
    }
    this.orderService.cancelOrderByBuyer(this.activeOrderId, cancelOrderInfo).subscribe(
      result => this.handleRequestResult(result, "It's failed to ask return. Please try again!")
    );

    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  endOrderCancel() {
    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  submitReturnExpress() {
    let expressIdCtrl = <HTMLInputElement>document.getElementById('express');
    let courierCtrl = <HTMLInputElement>document.getElementById('courier');

    let expressInfo = new Express(courierCtrl.value, expressIdCtrl.value);
    this.orderService.shipReturnByBuyer(this.activeOrderId, expressInfo).subscribe(
      result => this.handleRequestResult(result, "It's filed to upload express info. Please try again!")
    );

    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  cancelReturnExpress() {
    this.activeOrderId = '';
    this.activeOrderEventType = OrderEvent.none;
  }

  confirmOrder(orderId: string) {
    this.orderService.confirmOrderByBuyer(orderId).subscribe(
      result => this.handleRequestResult(result, "Confirm is failed. Please try again!")
    );
  }

  handleRequestResult(error: any, showMsg: string) {
    if (error == null) {
      location.reload(true);
    } else {
      if (error.hasOwnProperty('error')) {
        this.failedValue = showMsg;
      }
    }
  }
}

