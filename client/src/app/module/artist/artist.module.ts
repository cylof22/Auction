import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { API_ARTISTS_SERVICE_URL, ArtistService } from '../artist/service/artist.service';
import { environment } from '../../../environments/environment';
 
@NgModule({
    imports: [
        CommonModule,
        HttpModule,       
    ],

    providers: [
        ArtistService,
        { provide: API_ARTISTS_SERVICE_URL, useValue: environment.productionURL }
    ],
})

export class ArtistModule {}