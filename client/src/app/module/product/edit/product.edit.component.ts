import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../product/service/product.service'
import { UploadProduct, Product } from '../../product/product.model/product'

@Component({
    selector: 'product-edit',
    templateUrl: './product.edit.component.html',
    styleUrls: ['./product.edit.component.css']
})

export class ProductEditComponent {
    @Input() product: Product

    constructor(private productService: ProductService,
                private activeRoute: ActivatedRoute,
                private router:Router) {
    const productId = activeRoute.snapshot.params['productId'];
    this.productService.getProductById(productId).subscribe(
        product => this.product = product);
    }

    onUploadProduct(updateProduct) {
        this.productService.updateProduct(this.product.id, updateProduct).subscribe(
            output => {
                // handle error

                this.router.navigate(["/products/" + this.product.id]);
            }
        );
    }
}