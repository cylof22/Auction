import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Order, OrderStatus, OrderEvent } from './../order.model/order'
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

  statusValue: string;

  constructor(private orderService: OrderService,
              private route:Router) {
  }

  ngOnInit() {
    if (this.isBuyer == 'true') {
      this.initStateForBuyer();
    } else {
      this.initStateForSeller();
    }
  }

  initStateForBuyer() {
    switch (parseInt(this.order.status)) {
      case OrderStatus.inFix:
      case OrderStatus.dispatchConfirmed:
      this.statusValue = "system confirm";
      break;
      case OrderStatus.returnConfirmed:
      this.statusValue = "system cancel";
      break;
      case OrderStatus.inAuction:
      this.statusValue = "in auction";
      break;
      case OrderStatus.unshipped:
      this.statusValue = "not yet shipped";
      break;
      case OrderStatus.dispatched:
      this.statusValue = "dispatched";
      break;
      case OrderStatus.returnInAgree:
      this.statusValue = "Waiting for agree";
      break;
      case OrderStatus.returnAgreed:
      this.statusValue = "agreed";
      break;
      case OrderStatus.returnDispatched:
      this.statusValue = "product returned";
      break;
      case OrderStatus.returnCompleted:
      this.statusValue = "completed";
      break;
    }
  }

  initStateForSeller() {
    switch (parseInt(this.order.status)) {
      case OrderStatus.none:
      this.statusValue = "no buyer"
      break;
      case OrderStatus.inAuction:
      this.statusValue = "in auction"
      break;
      case OrderStatus.unshipped:
      this.statusValue = "waiting for your dispatch"
      break;
      case OrderStatus.returnInAgree:
      this.statusValue = "Waiting for your agree";
      break;
      case OrderStatus.returnAgreed:
      this.statusValue = "not yet shipped";
      break;
      case OrderStatus.returnDispatched:
      this.statusValue = "dispatched";
      break;
    }
  }

  checkLogistics() {
    // get express and then show its status
    //this.order.express
  }

  confirmOrderByBuyer() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.confirmOrderByBuyer
    }
    this.handleOrderEvent.emit(eventValue);
  }

  cancelOrderByBuyer() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.cancelOrderByBuyer
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

  cancelOrderBySeller() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.cancelOrderBySeller
    }
    this.handleOrderEvent.emit(eventValue);
  }

  shipGoodBySeller() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.uploadOrderExpress
    }
    this.handleOrderEvent.emit(eventValue);
  }

  agreeReturnBySeller() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.agreeReturn
    }
    this.handleOrderEvent.emit(eventValue);
  }

  confirmReturnBySeller() {
    let eventValue = {
      'id': this.order.id,
      'type': OrderEvent.confirmReturn
    }
    this.handleOrderEvent.emit(eventValue);
  }

  showProduct() {
    this.route.navigate(["/products/" + this.order.productId]);
  }


  testSystemConfirm() {
    let result = {"result": "success"};
    this.orderService.testSystemConfirm(this.order.id, result).subscribe(

    )
  }

  testSystemCancel() {
    let result = {"result": "success"};
    this.orderService.testSystemCancel(this.order.id, result).subscribe(

    )
  }
}

