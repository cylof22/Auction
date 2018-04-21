import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Product } from '../product.model/product';
import { Router } from '@angular/router';

@Component({
  selector: 'auction-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  @Input() product: Product;
  @Input() readonly: boolean = true;

  constructor(private sanitizer: DomSanitizer,
              private route:Router) {
  }

  showProduct() {
      let paras = {
        "readonly":this.readonly
    }

    this.route.navigate(["/products/" + this.product.id, paras]);
  }
}
