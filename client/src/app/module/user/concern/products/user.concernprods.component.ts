import { Component, Input } from '@angular/core';

import { ProductService } from './../../../product/service/product.service';
import {  FolloweeProduct } from './../../../product/product.model/followee';
import { UserService } from './../../service/user.service'

@Component({
  selector: 'user-concernprods-page',
  styleUrls: [ './user.concernprods.component.css' ],
  templateUrl: './user.concernprods.component.html'
})

export class ConcernProductsComponent {
  @Input("username") username: string;
  products: FolloweeProduct[];

  constructor(private userService: UserService,
              private productService: ProductService) {
  }

  ngOnInit() {
    // get concerned products
     this.userService.getConcernedProducts(this.username).subscribe(
        res => {
          this.products = res;
          //alert(this.products.length);
        }
    )}
}

