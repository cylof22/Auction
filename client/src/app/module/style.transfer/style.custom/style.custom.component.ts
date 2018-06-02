import { Component } from '@angular/core';
import { Product } from '../../product/product.model/product';
import { ProductService } from '../../product/service/product.service';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'style-custom',
    templateUrl: './style.custom.component.html',
    styleUrls: ['./style.custom.component.css'],
})

export class StyleCustomComponent {
    styles: Product[];
    selectedStyle: Product;
    hotest : boolean;
    errorMessage: string;
    lastHightlightCtrl: HTMLElement = null;

    constructor(private styleService : ProductService, activeRoute: ActivatedRoute) {
        this.hotest = activeRoute.snapshot.params["mode"] == "hotest";
        let inputProducts = null
        if(this.hotest) {
            // Todo: add getHotest product interface
            inputProducts = this.styleService.getProducts().retryWhen(errors => {
                this.errorMessage = `Please start the server. Retrying to connect.`;
                return errors
                .delay(10000) // Retry every 2 seconds
                //.take(3)   // Max number of retries
                .do(() => this.errorMessage += '.'); // Update the UI
            })
            .finally(() => this.errorMessage = null);
        } else {
            this.styleService.getProducts().retryWhen(errors => {
                this.errorMessage = `Please start the server. Retrying to connect.`;
                return errors
                .delay(10000) // Retry every 2 seconds
                //.take(3)   // Max number of retries
                .do(() => this.errorMessage += '.'); // Update the UI
            })
            .finally(() => this.errorMessage = null);
        }
        if(inputProducts != null) {
            inputProducts.subscribe(
                params => { 
                    this.styles = params;
                }
            );
        }
    }

    OnStyleChange(style: Product, image: HTMLElement) {
        this.selectedStyle = style;

        if (this.lastHightlightCtrl != image) {
            if (this.lastHightlightCtrl != null) {
                this.lastHightlightCtrl.style.borderStyle = image.style.borderStyle;
                this.lastHightlightCtrl.style.borderColor = image.style.borderColor;
            }

            image.style.borderStyle = 'solid';
            image.style.borderColor = 'cornflowerblue';
            this.lastHightlightCtrl = image;
        }
    }

    getSelectedStyle() : string {
        return this.selectedStyle.url;
    }
}
