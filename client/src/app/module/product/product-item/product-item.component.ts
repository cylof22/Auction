import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Product } from '../product.model/product';

@Component({
  selector: 'auction-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  @Input() product: Product;

  constructor(private sanitizer: DomSanitizer) {
  }

  showProduct() {
    location.href = "/#/products/" + this.product.id;
  }
}
