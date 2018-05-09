import { Component, Input } from '@angular/core';

import { ProductService } from './../../product/service/product.service';
import { Product } from '../../product/product.model/product';

@Component({
  selector: 'user-products-page',
  styleUrls: [ './user.products.component.css' ],
  templateUrl: './user.products.component.html'
})

export class UserProductsComponent {
  @Input("username") username: string;
  myProducts: Product[];

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
      // get owned products
    let searchParas = {
        "owner":this.username,
    } 
    this.productService.search(searchParas).subscribe(
        params => this.myProducts = params
    );
  }
}

