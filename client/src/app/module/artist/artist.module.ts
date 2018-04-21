import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { API_ARTISTS_SERVICE_URL, ArtistService } from '../artist/service/artist.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,       
    ],

    providers: [
        ArtistService,
        { provide: API_ARTISTS_SERVICE_URL, useValue: "http://localhost:8000" }
    ],
})

export class ArtistModule {}