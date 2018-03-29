import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { StyleUploadComponent } from "./style.upload/style.upload.component"
import { StyleUploadService, STYLE_API_UPLOAD_SERVICE_URL } from "./services/style.upload.service"

@NgModule({
    declarations: [
        StyleUploadComponent,
    ],

    exports: [
        StyleUploadComponent,
    ],

    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([
            {path: 'style-upload', component: StyleUploadComponent }
        ])
    ],

    providers:[
        StyleUploadService,
        {provide: STYLE_API_UPLOAD_SERVICE_URL, useValue: "http://h20458g434.imwork.net:41827/api/upload"},
    ],
})


export class StyleUploadModule { }