import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DomSanitizer } from '@angular/platform-browser';
import { Product } from './../product.model/product';
import { ProductService } from './../service/product.service';

@Component({
  selector: 'auction-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  @Input() product: Product;

  loverCount: string;
  shareCount: string;
  commentCount: string;

  constructor(private sanitizer: DomSanitizer,
              private productService: ProductService,
              private route:Router) {

    this.loverCount = this.createRandomNumber(5);
    this.shareCount = this.createRandomNumber(5);
    this.commentCount = this.createRandomNumber(5);
  }

  createRandomNumber(n){
    let rnd="";
    for(let i=0; i<n; i++)
        rnd += Math.floor(Math.random()*10);
    return rnd;
}

  showProduct() {
    this.route.navigate(["/products/" + this.product.id]);
  }
}
