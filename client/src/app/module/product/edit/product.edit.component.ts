import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../product/service/product.service'
import { UploadProduct, Product } from '../../product/product.model/product'

@Component({
    selector: 'product-edit',
    templateUrl: './product.edit.component.html',
    styleUrls: ['./product.edit.component.css']
})

export class ProductEditComponent {
    product: Product
    errorInfo: string = '';

    constructor(private productService: ProductService,
                private activeRoute: ActivatedRoute,
                private router:Router) {
    const productId = activeRoute.snapshot.params['productId'];
    this.productService.getProductById(productId).subscribe(
        product => this.product = product);
    }

    onUploadProduct(data) {
        let updateProduct : UploadProduct = data;
        updateProduct.picData = this.product.url;
        this.productService.updateProduct(this.product.id, updateProduct).subscribe(
            output => {
                if (output == null) {
                    this.router.navigate(["/products/" + this.product.id]);
                } else {
                    if (output.hasOwnProperty('error')) {
                        this.errorInfo = output['error'];
                    }
                }
            }
        );
    }
}