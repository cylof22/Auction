import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { StyleTransferComponent } from './style.transfer/style.transfer.component';
import { StyleTransferService, STYLE_TRANSFER_SERVICE_URL } from './services/style.service';

@NgModule({
    declarations: [
        StyleTransferComponent,
    ],
    imports: [
        CommonModule,
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
        {provide: STYLE_TRANSFER_SERVICE_URL, useValue: "http://localhost:9090/styletransfer"},
    ]
})

export class StyleTransferModule { }