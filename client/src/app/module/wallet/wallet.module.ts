import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { WalletComponent } from './wallet/wallet.component';

@NgModule({
    declarations: [
        WalletComponent,
    ],

    exports: [
        WalletComponent,
    ],

    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([
            {path: 'wallet', component: WalletComponent }
        ])
    ]
})

export class WalletModule {}