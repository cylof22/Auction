import { Component } from '@angular/core';
import { Product } from '../../product/product.model/product';
import { ProductService } from '../../product/service/product.service';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'style-custom',
    templateUrl: './style.custom.component.html',
    styleUrls: ['/style.custom.component.css'],
})

export class StyleCustomComponent {
    styles: Product[];
    selectedStyle: Product;
    hotest : boolean;

    constructor(private styleService : ProductService, activeRoute: ActivatedRoute) {
        this.hotest = activeRoute.snapshot.params["mode"] == "hotest";

        if(this.hotest) {
            // Todo: add getHotest product interface
            this.styleService.getProducts().subscribe(
                params => { 
                    this.styles = params;
                    
                }
            );
        } else {
            this.styleService.getProducts().subscribe(
                params => { 
                    this.styles = params;
                }
            );
        }
    }

    OnStyleChange(style: Product) {
        this.selectedStyle = style;

        let img = document.getElementById("selectedStyle");
        img.setAttribute("src", style.url);
    }

    getSelectedStyle() : string {
        return this.selectedStyle.url;
    }
}
