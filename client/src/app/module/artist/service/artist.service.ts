import { Inject, Injectable, OpaqueToken } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Artist } from '../artist.model/artist';

export const API_ARTISTS_SERVICE_URL = new OpaqueToken("api-artists-url");

@Injectable()
export class ArtistService {
    constructor(private http: HttpClient,
        @Inject(API_ARTISTS_SERVICE_URL) private artistURL : string,
    ) {}
    
    getArtists(): Observable<Artist[]> {
        return this.http.get<Artist[]>(this.artistURL + '/api/artists');
    }

    getHotestArtists(): Observable<Artist[]> {
        return this.http.get<Artist[]>(this.artistURL + '/api/artists/hotest');
    }
}
