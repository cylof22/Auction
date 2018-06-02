import { Component } from '@angular/core';
import { ArtistService } from '../../artist/service/artist.service';
import { ActivatedRoute } from "@angular/router";
import { Artist } from '../../artist/artist.model/artist';
import { Observable } from 'rxjs/Observable'

@Component({
    selector: 'style-artist',
    styleUrls: ['./style.artist.component.css'],
    templateUrl: './style.artist.component.html',
})

export class StyleArtistComponent {
    artists: Artist[];
    selectedArtist : Artist;
    errorMessage: string;
    hotest : boolean;
    lastHightlightCtrl: HTMLElement = null;

    constructor(private artistService: ArtistService, activeRoute: ActivatedRoute) {
        this.hotest = activeRoute.snapshot.params["mode"] == "hotest";
        if(this.hotest) {
            this.artistService.getHotestArtists().subscribe( params => {
                this.artists = params;
            })
        } else {
            this.artistService.getArtists().subscribe( params => {
                this.artists = params;
            })
        }
    }

    getSelectedArtistModel() : string {
        return this.selectedArtist.modelname;
    }

    OnSelectedArtist(artist: Artist, image: HTMLElement) {
        this.selectedArtist = artist;

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
}