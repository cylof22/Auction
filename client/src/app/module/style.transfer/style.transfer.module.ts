import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { StyleTransferComponent } from './style.transfer/style.transfer.component';
import { FileUploadModule, FileSelectDirective } from 'ng2-file-upload';
import { StyleTransferService, STYLE_TRANSFER_SERVICE_URL, STYLE_TRANSFER_BY_ARTIST_SERVICE_URL, STYLE_TRANSFER_UPLOAD_SERVICE_URL } from './services/style.service';
import { StyleCustomComponent } from './style.custom/style.custom.component';
import { StyleArtistComponent } from './style.artist/style.artist.component';

@NgModule({
    declarations: [
        StyleTransferComponent,
        StyleCustomComponent,
        StyleArtistComponent,
    ],
    imports: [
        CommonModule,
        FileUploadModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([
            {
                path: 'style-transfer', component: StyleTransferComponent, 
                children: [
                    { path: 'styles/:mode', component: StyleCustomComponent },
                    { path: 'artists/:mode', component: StyleArtistComponent },
                ],
            },
          ]),
    ],
    exports: [
        StyleTransferComponent,
        StyleCustomComponent,
        StyleArtistComponent,
    ],
    providers: [
        StyleTransferService,
        { provide: STYLE_TRANSFER_SERVICE_URL, useValue: "http://localhost:9090/styleTransfer" },
        { provide: STYLE_TRANSFER_BY_ARTIST_SERVICE_URL, useValue: "http://localhost:9090/artistStyle"},
        {provide: STYLE_TRANSFER_UPLOAD_SERVICE_URL, useValue: "http://localhost:8000/api/upload"},
    ]
})
export class StyleTransferModule { }