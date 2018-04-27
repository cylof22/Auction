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
    artists: Observable<Artist[]> ;
    selectedArtist : Artist;
    errorMessage: string;
    hotest : boolean;

    constructor(private artistService: ArtistService, activeRoute: ActivatedRoute) {
        this.hotest = activeRoute.snapshot.params["mode"] == "hotest";
        if(this.hotest) {
            this.artists = this.artistService.getHotestArtists()
                .retryWhen(errors => {
                this.errorMessage = `Please start the server. Retrying to connect.`;
                return errors
                .delay(2000) // Retry every 2 seconds
                //.take(3)   // Max number of retries
                .do(() => this.errorMessage += '.'); // Update the UI
            })
            .finally(() => this.errorMessage = null);
        } else {
            this.artists = this.artistService.getArtists()
                .retryWhen(errors => {
                this.errorMessage = `Please start the server. Retrying to connect.`;
                return errors
                .delay(2000) // Retry every 2 seconds
                //.take(3)   // Max number of retries
                .do(() => this.errorMessage += '.'); // Update the UI
            })
            .finally(() => this.errorMessage = null);
        }
    }

    getSelectedArtistModel() : string {
        return this.selectedArtist.modelname;
    }

    OnSelectedArtist(artist: Artist) {
        this.selectedArtist = artist;
    }
}