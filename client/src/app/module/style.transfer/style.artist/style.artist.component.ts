import { Component } from '@angular/core';
import { ProductService } from '../../product/service/product.service';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'style-artist',
    templateUrl: './style.artist.component.html',
})

export class StyleArtistComponent {
    artists: string[];
    selectedArtist : string;

    hotest : boolean;

    constructor(private artistService: ProductService, activeRoute: ActivatedRoute) {
        this.hotest = activeRoute.snapshot.params["mode"] == "hotest";
        if(this.hotest) {

        } else {

        }
    }

    getSelectedArtist() : string {
        return this.selectedArtist;
    }
}