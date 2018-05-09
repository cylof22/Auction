import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Order, OrderState, OrderEvent } from './../order.model/order'
import { OrderService } from './../service/order.service'

@Component({
  selector: 'order-item-page',
  styleUrls: [ './order.item.component.css' ],
  templateUrl: './order.item.component.html'
})

export class OrderItemComponent {
  @Input() order: Order;
  @Input('isBuyer') isBuyer: string; 
  @Output() handleOrderEvent: EventEmitter<any> = new EventEmitter;

  stateValue: string;

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    if (this.isBuyer == 'true') {
      this.initStateForBuyer();
    } else {
      this.initStateForSeller();
    }
  }

  initStateForBuyer() {
    switch (this.order.state) {
      case OrderState.auction:
      this.stateValue = "in auction";
      break;
      case OrderState.unshipped:
      this.stateValue = "not yet shipped";
      break;
      case OrderState.dispatched:
      this.stateValue = "dispatched";
      break;
      case OrderState.returnInAgree:
      this.stateValue = "Waiting for agree";
      break;
      case OrderState.returnAgreed:
      this.stateValue = "agreed";
      break;
      case OrderState.returnReturned:
      this.stateValue = "product returned";
      break;
      case OrderState.returnCompleted:
      this.stateValue = "completed";
      break;
    }
  }

  initStateForSeller() {
    switch (this.order.state) {
      case OrderState.unshipped:
      this.stateValue = "waiting for your dispath"
      break;
      case OrderState.returnInAgree:
      this.stateValue = "Waiting for your agree";
      break;
      case OrderState.returnAgreed:
      this.stateValue = "not yet shipped";
      break;
      case OrderState.returnReturned:
      this.stateValue = "dispatched";
      break;
    }
  }

  checkLogistics() {
    // get express and then show its status
    //this.order.express
  }

  confirmOrderByBuyer() {
    this.orderService.confirmOrderByBuyer(this.order.id);
  }

  cancelOrderByBuyer() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.cancelOrder
    }
    this.handleOrderEvent.emit(eventValue);
  }

  shipReturnByBuyer() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.uploadReturnExpress
    }
    this.handleOrderEvent.emit(eventValue);
  }

  shipGoodsBySeller() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.uploadOrderExpress
    }
    this.handleOrderEvent.emit(eventValue);
  }

  agreeReturnBySeller() {
    this.orderService.agreeReturnBySeller(this.order.id);
  }

  confirmReturnBySeller() {
    this.orderService.confirmReturnBySeller(this.order.id);
  }
}

