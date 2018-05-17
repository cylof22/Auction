import { Component, Input } from '@angular/core';

import { ProductService } from './../../product/service/product.service';
import { Product } from './../../product/product.model/product';
import { OrderService } from './../../order/service/order.service'
import { Order } from './../../order/order.model/order'

@Component({
  selector: 'user-products-page',
  styleUrls: [ './user.products.component.css' ],
  templateUrl: './user.products.component.html'
})

export class UserProductsComponent {
  @Input("username") username: string;
  myProducts: Product[];
  mySellings: Order[];    // use this parameter to judge if one product is edited

  constructor(private productService: ProductService,
              private orderService: OrderService) {
  }

  ngOnInit() {
      // get owned products
    let searchParas = {
        "owner":this.username,
    } 
    this.productService.search(searchParas).subscribe(
        params => this.myProducts = params
    );

    this.orderService.getMySellings(this.username).subscribe(
      orders => this.mySellings = orders
    )
  }

  isReadonly(productId: string) {
    if (this.mySellings == null) {
      return false;
    }

    for (let i = 0; i < this.mySellings.length; i++) {
      if (this.mySellings[i].id == productId) {
        return true;
      }
    }

    return false;
  }
}

