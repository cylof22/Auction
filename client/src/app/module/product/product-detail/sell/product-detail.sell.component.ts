import { Component, Input} from '@angular/core';
import { DatePipe } from '@angular/common';

import { AuthenticationService } from './../../../authentication/services/authentication.service'
import { OrderStatus, ProductInfo, SellInfo } from './../../../order/order.model/order';
import { OrderService } from './../../../order/service/order.service'
import { EPriceType, Product, ProductPrice } from './../../product.model/product';

@Component({
  selector: 'product-detail-sell-page',
  styleUrls: [ './product-detail.sell.component.css' ],
  templateUrl: './product-detail.sell.component.html'
})
export class ProductDetailSellComponent{
  @Input() product: Product;
  @Input() orderStatus: string;

  canBeSold: boolean;
  defaultSaleCheckStatus: string;
  errorInfo: string;

  constructor(private authService: AuthenticationService,
              private orderService: OrderService) {
      this.canBeSold = false;
      this.defaultSaleCheckStatus = 'true';
  }

  ngOnInit() {
    if (this.product.price.type == '') {
        this.product.price.type = '2';
    }

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
        fromItsOwner = (currentUser == this.product.owner);
    }

    this.canBeSold = false;
    // 2 indicates that the product is still not be sold and user can sell it now
    if (logined && fromItsOwner && parseInt(this.product.price.type) == EPriceType.OnlyShow) {
        if (this.orderStatus == undefined || this.orderStatus == '') {
            this.canBeSold = true;          // no order info
        }
    }
  }

  onSaleSwitch(checked: boolean) {
    if (!checked) {
        this.errorInfo='';
    }
  }

  onSell(data: ProductPrice) {
    let productInfo = new ProductInfo('', '', '', '', '', '');
    productInfo.priceValue = data.value;
    productInfo.priceType = data.type;
    productInfo.id = this.product.id;
    productInfo.owner = this.product.owner;
    productInfo.type = this.product.type;
    productInfo.url = this.product.url;

    let sellInfo = new SellInfo(productInfo, '', '') 
    sellInfo.duration = data.duration;
    sellInfo.startTime = this.getNowFormatDate();

    this.orderService.sell(sellInfo).subscribe(
      result => {
        if (result == null) {
          location.reload(true);
        } else {
          if (result.hasOwnProperty('error')) {
            this.errorInfo = result['error'];
          }
        }
      }
    )
  }

  getNowFormatDate(): string {
    let dataPipe = new DatePipe("en-US");
      let date = new Date();
      let currentdate = dataPipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
      return currentdate;
  }
}
