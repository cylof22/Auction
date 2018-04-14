import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { StyleUploadComponent } from "./style.upload/style.upload.component"
import { StyleUploadService, STYLE_API_UPLOAD_SERVICE_URL } from "./services/style.upload.service"
import { AuthGuard } from './../../interceptor/auth.guard'

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
            {path: 'style-upload', component: StyleUploadComponent, canActivate: [AuthGuard] }
        ])
    ],

    providers:[
        AuthGuard,
        StyleUploadService,
        {provide: STYLE_API_UPLOAD_SERVICE_URL, useValue: "http://127.0.0.1:8000/api/upload/style"},
    ],
})


export class StyleUploadModule { }