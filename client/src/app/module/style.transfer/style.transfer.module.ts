import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { StyleTransferComponent } from './style.transfer/style.transfer.component';
import { FileUploadModule, FileSelectDirective } from 'ng2-file-upload';
import { StyleTransferService, STYLE_TRANSFER_SERVICE_URL, STYLE_TRANSFER_UPLOAD_SERVICE_URL } from './services/style.service';

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
        {provide: STYLE_TRANSFER_SERVICE_URL, useValue: "http://h20458g434.imwork.net:41488/styleTransfer"},
        {provide: STYLE_TRANSFER_UPLOAD_SERVICE_URL, useValue: "http://h20458g434.imwork.net:41827/api/upload"},
    ]
})
export class StyleTransferModule { }