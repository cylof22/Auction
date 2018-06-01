import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Product } from './../product.model/product'
import { Review } from './../product.model/review';
import { ProductService } from './../service/product.service';
import { AuthenticationService } from './../../authentication/services/authentication.service'
import { OrderService } from './../../order/service/order.service'
import { Order, SellInfo, Express, ReturnInfo, BuyInfo, ProductInfo } from './../../order/order.model/order'
import { BidService } from './bid.service';

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
  errorInfo: string;

  constructor(private productService: ProductService,
              private bidService: BidService,
              private authService: AuthenticationService,
              private orderService: OrderService,
              router: ActivatedRoute) {

    this.errorInfo = '';
    this.priceType = 'Only Exhibition';

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
        this.setStoryInfo(product);
      },
      error => console.error(error));
  }

  getCurrentOrder(productId: string) {
    this.orderService.getOrderByProductId(productId).subscribe(
      order => {
        this.order = order;
        this.setPrice(order);
      }
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

  setPrice(order: Order) {
    switch (parseInt(order.product.priceType)) {
      case 0:
      this.priceType = "Fixed Price";
      break;
      case 1:
      this.priceType = "Starting Price";
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
}
