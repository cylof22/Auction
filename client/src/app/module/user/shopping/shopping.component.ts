import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'

import { ProductService } from './../../product/service/product.service';
import { UserService } from '../service/user.service';
import { Product } from '../../product/product.model/product';
import { UserInfo } from '../user.model/user'

@Component({
  selector: 'user-shopping-page',
  styleUrls: [ './shopping.component.css' ],
  templateUrl: './shopping.component.html'
})

export class UsershoppingComponent {
  productsInShopping: Product[];

  constructor(private productService: ProductService,
              private userService: UserService,
              router: ActivatedRoute) {

    const username = router.snapshot.params['username'];
    
    // get owned products
    let searchParas = {
        "owner":username,
    } 
    this.productService.search(searchParas).subscribe(
        params => this.productsInShopping = params
    );

    this.userService.getProductsInShopping(username).subscribe(
        params => this.productsInShopping = params
    );
  }
}

