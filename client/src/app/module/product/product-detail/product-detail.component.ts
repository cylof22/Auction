import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Product } from './../product.model/product'
import { Review } from './../product.model/review';
import { ProductService } from './../service/product.service';
import { AuthenticationService } from './../../authentication/services/authentication.service'
import { OrderService } from './../../order/service/order.service'
import { Order, SellInfo, Express, ReturnInfo, BuyInfo } from './../../order/order.model/order'
import { BidService } from './bid.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'product-detail-page',
  styleUrls: [ './product-detail.component.css' ],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnDestroy {
  product: Product;
  order: Order;

  productType: string;
  priceType: string;
  hasStory: boolean;
  hasStoryPic: boolean;
  hasError: boolean;

  constructor(private productService: ProductService,
              private bidService: BidService,
              private authService: AuthenticationService,
              private orderService: OrderService,
              router: ActivatedRoute) {

    this.hasError = false;

    const productId = router.snapshot.params['productId'];
    this.getCurrentProduct(productId);

    this.getCurrentOrder(productId);
  }

  ngOnInit() {
  }

  getCurrentProduct(productId: string) {
    this.productService
    .getProductById(productId)
    .subscribe(
      product => {
        this.product = product;
        if (this.product.maker == "") {
          this.product.maker = this.product.owner;
        }
        if (this.product.price.duration == "") {
          this.product.price.duration = "30";
        }
        this.setProductType(product);
        this.setPrice(product);
        this.setStoryInfo(product);
      },
      error => console.error(error));
  }

  getCurrentOrder(productId: string) {
    this.orderService.getOrderByProductId(productId).subscribe(
      order => this.order = order
    )
  }

  setProductType(product: Product) {
    switch (parseInt(product.type)) {
      case 0:
      this.productType = "Digital picture";
      break;
      case 1:
      this.productType = "Material object"
      break;
    }
  }

  setPrice(product: Product) {
    switch (parseInt(product.price.type)) {
      case 0:
      this.priceType = "Fixed Price";
      break;
      case 1:
      this.priceType = "Auction Price";
      break;
      case 2:
      this.priceType = "Only Exhibition"
      break;
    }
  }

  setStoryInfo(product: Product) {
    this.hasStory = false;
    if (product.story != undefined) {
      this.hasStoryPic = false;
      if (product.story.pictures.length > 0) {
        this.hasStoryPic = true;

        if (product.story.description != "") {
          this.hasStory = true;
        }
      }
    }
  }

  ngOnDestroy(): any {
  }

  buy(data) {
    let buyInfo : BuyInfo = data;
    if (buyInfo.startTime == '') {
      buyInfo.startTime = this.getNowFormatDate();
    }

    this.orderService.buy(this.order.id, buyInfo).subscribe(
      result => {
        if (result == null) {
          location.reload(true);
        } else {
          if (result.hasOwnProperty('error')) {
            this.hasError = true;
          }
        }
      }
    )
  }

  sell(data) {
    let sellInfo = new SellInfo('', '', '', '', '', '', '', '')   
    sellInfo.duration = this.product.price.duration;
    sellInfo.priceValue = this.product.price.value;
    sellInfo.priceType = this.product.price.type;
    sellInfo.productId = this.product.id;
    sellInfo.productOwner = this.product.owner;
    sellInfo.productType = this.product.type;
    sellInfo.productUrl = this.product.url;
    sellInfo.startTime = this.getNowFormatDate();

    this.orderService.sell(sellInfo).subscribe(
      result => {
        if (result == null) {
          location.reload(true);
        } else {
          if (result.hasOwnProperty('error')) {
            this.hasError = true;
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
