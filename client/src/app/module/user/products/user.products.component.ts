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
    // Todo: insert the authentication information
    // JWT token
    this.productService.getProductsByUser(this.username).subscribe(
        params => this.myProducts = params
    );
  }
}

