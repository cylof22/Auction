import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DomSanitizer } from '@angular/platform-browser';
import { Product } from './../product.model/product';
import { ProductService } from './../service/product.service';

@Component({
  selector: 'auction-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;

  errorMessage: string;
  loverCount: string;
  rating: string;
  commentCount: string;

  constructor(private sanitizer: DomSanitizer,
              private productService: ProductService,
              private route:Router) {
  }

  ngOnInit() {
    this.productService.getSocialSummaryById(this.product.id)
    .retryWhen(errors => {
      return errors
        .delay(10000) // Retry every 2 seconds
        //.take(3)   // Max number of retries
        .do(() => this.errorMessage += '.'); // Update the UI
    })
    .finally(() => this.errorMessage = null)
    .subscribe(
        summary => { 
          this.loverCount = summary.followeeCount.toString();
          this.rating = summary.starRated.toString();
          this.commentCount = summary.commentCount.toString();
        },
        error => {
          console.error(error);
        }
    )
  }

  showProduct() {
    this.route.navigate(["/products/" + this.product.id]);
  }
}
