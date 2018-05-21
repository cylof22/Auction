import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AuthenticationService } from './../../../authentication/services/authentication.service'
import { OrderStatus } from '../../../order/order.model/order';
import { EPriceType } from '../../product.model/product';

@Component({
  selector: 'product-detail-sell-page',
  styleUrls: [ './product-detail.sell.component.css' ],
  templateUrl: './product-detail.sell.component.html'
})
export class ProductDetailSellComponent{
  @Input() productOwner: string;
  @Input() priceType: string;
  @Input() orderStatus: string;
  @Output() handleSellEvent: EventEmitter<any> = new EventEmitter;

  canBeSold: boolean;

  constructor(private authService: AuthenticationService) {
      this.canBeSold = false;
  }

  ngOnInit() {
    let logined = false;
    let fromItsOwner = false;
    let currentUser = '';
    if (this.authService.currentUser != null) {
        currentUser = this.authService.currentUser.username;
    }
    if (currentUser == '') {
        logined = false;
    } else {
        logined = true;
        fromItsOwner = (currentUser == this.productOwner);
    }

    this.canBeSold = false;
    if (logined && fromItsOwner && parseInt(this.priceType) != EPriceType.OnlyShow) {
        if (this.orderStatus == undefined || this.orderStatus == '') {
            this.canBeSold = true;          // no order info
        }
    }
  }

  onSell() {
    this.handleSellEvent.emit('');
  }
}
