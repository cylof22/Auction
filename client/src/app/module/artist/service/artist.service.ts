import { Inject, Injectable, Injector, InjectionToken } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Artist } from '../artist.model/artist';

export const API_ARTISTS_SERVICE_URL = new InjectionToken<string>("api-artists-url");

@Injectable()
export class ArtistService {
    private artistURL : string;

    constructor(private http: HttpClient, injector : Injector) {
        this.artistURL = injector.get(API_ARTISTS_SERVICE_URL);
    }
    
    getArtists(): Observable<Artist[]> {
        return this.http.get<Artist[]>(this.artistURL + '/api/artists');
    }

    getHotestArtists(): Observable<Artist[]> {
        return this.http.get<Artist[]>(this.artistURL + '/api/artists/hotest');
    }
}
