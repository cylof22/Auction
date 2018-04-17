import { Inject, Injectable, OpaqueToken } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Artist } from '../artist.model/artist';

export const API_ARTISTS_SERVICE_URL = new OpaqueToken("api-artists-url");

@Injectable()
export class ArtistService {
    constructor(private http: Http,
        @Inject(API_ARTISTS_SERVICE_URL) private artistURL : string,
    ) {}
    
    getArtists(): Observable<Artist[]> {
        return this.http.get(this.artistURL + '/api/artists')
          .map(response => response.json());
    }

    getHotestArtists(): Observable<Artist[]> {
        return this.http.get(this.artistURL + '/api/artists/hotest')
            .map(res => res.json());
    }
}
