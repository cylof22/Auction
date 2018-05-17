import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AuthenticationService } from './../../../authentication/services/authentication.service'
import { OrderStatus, BuyInfo } from '../../../order/order.model/order';
import { EPriceType, EProdcutType } from './../../../product/product.model/product'

@Component({
  selector: 'product-detail-buy-page',
  styleUrls: [ './product-detail.buy.component.css' ],
  templateUrl: './product-detail.buy.component.html'
})
export class ProductDetailBuyComponent{
  @Input() productOwner: string;
  @Input() priceType: string;
  @Input() orderStatus: string;
  @Input() priceValue: string;
  @Output() handleBuyEvent: EventEmitter<any> = new EventEmitter;

  canBeBought: boolean;
  hasError: boolean;
  isBtnDisabled: boolean;

  constructor(private authService: AuthenticationService) {
    this.canBeBought = false;
  }

  ngOnInit() {
    let logined = false;
    let fromItsOwner = true;
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

    // if the product is in selling
    let isInSelling = false;
    if (this.orderStatus != undefined && this.orderStatus != '') {
        isInSelling = true;
    }

    // if the product can be bought
    if (logined && !fromItsOwner && isInSelling) {
        let iPriceType = parseInt(this.priceType);
        if (iPriceType == EPriceType.Fix) {
            this.initForFixPrice();
        } else if (iPriceType == EPriceType.Auction) {
            this.initForAuctionPrice();
        }
    }

    this.isBtnDisabled = true;
  }

  initForFixPrice() {
    if (parseInt(this.orderStatus) == OrderStatus.none) {
        this.canBeBought = true;
    } else {
        this.canBeBought = false;
    }
  }

  initForAuctionPrice() {
    let iOrderStatus = parseInt(this.orderStatus);
    if (iOrderStatus == OrderStatus.none ||
        iOrderStatus == OrderStatus.inAuction ) {
        this.canBeBought = true;
    } else {
        this.canBeBought = false;
    }
  }

  onBuyWithDigitalCash() {
    let outputPrice = this.priceValue;

    let priceInputCtrl = <HTMLInputElement>document.getElementById('priceInput');
    if (priceInputCtrl != null) {
        outputPrice = priceInputCtrl.value;
    }

    let buyInfo = new BuyInfo(this.authService.currentUser.username,
                              outputPrice, '');
    this.handleBuyEvent.emit(buyInfo);
  }

  beginPrice(priceInput: HTMLInputElement) {
    this.hasError = false;
  }

  endPrice(priceInput: HTMLInputElement) {
    if (parseFloat(priceInput.value) < parseFloat(this.priceValue)) {
      this.hasError = true;
      this.isBtnDisabled = true;
    } else {
        this.isBtnDisabled = false;
    }
  }

  getBtnStatus() : boolean {
      return this.isBtnDisabled;
  }
}
