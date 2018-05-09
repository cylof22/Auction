import { Component, Input } from '@angular/core';

import { ProductService } from './../../../product/service/product.service';
import { Product } from './../../../product/product.model/product';
import { UserService } from './../../service/user.service'

@Component({
  selector: 'user-concernprods-page',
  styleUrls: [ './user.concernprods.component.css' ],
  templateUrl: './user.concernprods.component.html'
})

export class ConcernProductsComponent {
  @Input("username") username: string;
  products: Product[];

  constructor(private userService: UserService,
              private productService: ProductService) {
  }

  ngOnInit() {
    // get concerned products
/*     this.userService.getConcernedProducts(this.username).subscribe(
        res => this.products = res
    )} */

        //this.test();
    }

    test() {
        let searchParas = {
            "owner":this.username,
        }
        this.productService.search(searchParas).subscribe(
            res => this.products = res
        )
    }
}

