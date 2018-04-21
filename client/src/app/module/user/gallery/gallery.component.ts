import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { ActivatedRoute } from '@angular/router';

import { ProductService } from './../../product/service/product.service';
import { Product } from './../../product/product.model/product';
import { AuthenticationService } from './../../authentication/services/authentication.service'
import { User } from './../user.model/user'
import { UserService } from "./../service/user.service"

@Component({
  selector: 'gallery-show',
  styleUrls: [ './gallery.component.css' ],
  templateUrl: './gallery.component.html'
})
export class GalleryComponent {
  myProducts: Product[];
  concernedProducts: Product[];

  constructor(private productService: ProductService,
              private userService: UserService,
              router: ActivatedRoute) {

    const username = router.snapshot.params['username'];

    // get owned products
    let searchParas = {
        "owner":username,
    } 
    this.productService.search(searchParas).subscribe(
        params => this.myProducts = params
    );

    // get concerned products
    this.productService.getProducts().subscribe(
        params => this.concernedProducts = params
    );
/*     this.userService.getConcernedProducts(username).subscribe(
        params => this.concernedProducts = params
    ) */
  }
}

