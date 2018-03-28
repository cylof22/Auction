import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { StyleTransferComponent } from './style.transfer/style.transfer.component';
import { FileUploadModule, FileSelectDirective } from 'ng2-file-upload';
<<<<<<< HEAD
import { StyleTransferService, STYLE_TRANSFER_SERVICE_URL, STYLE_TRANSFER_UPLOAD_SERVICE_URL } from './services/style.service';
=======
import { StyleTransferService, STYLE_TRANSFER_SERVICE_URL } from './services/style.service';
>>>>>>> b1dbcc63af37a2f995b4e027d018186311cd5d1d

@NgModule({
    declarations: [
        StyleTransferComponent,
    ],
    imports: [
        CommonModule,
        FileUploadModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([
            {path: 'style-transfer', component: StyleTransferComponent},
          ]),
    ],
    exports: [
        StyleTransferComponent,
    ],
    providers: [
        StyleTransferService,
<<<<<<< HEAD
        {provide: STYLE_TRANSFER_SERVICE_URL, useValue: "http://localhost:5000/styleTransfer"},
        {provide: STYLE_TRANSFER_UPLOAD_SERVICE_URL, useValue: "http://localhost:9090/styleTransfer"},
=======
        {provide: STYLE_TRANSFER_SERVICE_URL, useValue: "http://localhost:9090/styleTransfer"},
>>>>>>> b1dbcc63af37a2f995b4e027d018186311cd5d1d
    ]
})

export class StyleTransferModule { }