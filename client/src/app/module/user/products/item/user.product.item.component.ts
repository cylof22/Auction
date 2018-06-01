import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from './../../../product/product.model/product';
import { ProductService } from './../../../product/service/product.service';

@Component({
  selector: 'user-product-item-page',
  templateUrl: './user.product.item.component.html',
  styleUrls: ['./user.product.item.component.css']
})
export class UserProductItemComponent {
  @Input() product: Product;
  @Input() readonly: string;

  canShowEditCtrls: boolean = false;

  constructor(private productService: ProductService,
              private route:Router) {
  }

  ngOnInit() {
  }

  showProduct() {
    this.route.navigate(["/products/" + this.product.id]);
  }

  showCtrls(imageCtrl: HTMLElement) {
    if (this.readonly == 'false') {
      this.canShowEditCtrls = true;
    }
  }

  removeCtrls(imageCtrl: HTMLElement) {
    if (this.readonly == 'false') {
      this.canShowEditCtrls = false;
    }
  }

  onEdit() {
    this.route.navigate(["/products/" + this.product.id + "/edit"]);
  }

  onDelete() {
    this.productService.deleteProduct(this.product.id).subscribe(
      res => location.reload(true)
    );
  }
}
