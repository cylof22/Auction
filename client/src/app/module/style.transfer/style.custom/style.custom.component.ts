import { Component } from '@angular/core';
import { Product } from '../../product/product.model/product';
import { ProductService } from '../../product/service/product.service';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'style-custom',
    templateUrl: './style.custom.component.html',
})

export class StyleCustomComponent {
    styles: Product[];
    defaultStyleURL : string;
    selectedStyle: Product;
    hotest : boolean;

    constructor(private styleService : ProductService, activeRoute: ActivatedRoute) {
        this.hotest = activeRoute.snapshot.params["mode"] == "hotest";

        if(this.hotest) {
            // Todo: add getHotest product interface
            this.styleService.getProducts().subscribe(
                params => { 
                    this.styles = params;
                    this.defaultStyleURL = this.styles[0].url;
                }
            );
        } else {
            this.styleService.getProducts().subscribe(
                params => { 
                    this.styles = params;
                    this.defaultStyleURL = this.styles[0].url;
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
