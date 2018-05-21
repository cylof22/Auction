import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Product } from '../product.model/product';
import { Router } from '@angular/router';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'auction-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  @Input() product: Product;
  @Input() readonly: string;
  @Input() fromItsOwner: string;
  canShowEditCtrls: boolean;

  constructor(private sanitizer: DomSanitizer,
              private productService: ProductService,
              private route:Router) {
  }

  ngOnInit() {
  }

  showProduct() {
    this.route.navigate(["/products/" + this.product.id]);
  }

  showEditCtrls() {
    if (this.readonly == 'true') {
      return;
    }

    this.canShowEditCtrls = true;
  }

  removeEditCtrls() {
    if (this.readonly == 'true') {
      return;
    }

    this.canShowEditCtrls = false;
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
