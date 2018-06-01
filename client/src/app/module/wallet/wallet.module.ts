import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { AuthGuard } from './../../interceptor/auth.guard';

import { WalletComponent } from './wallet/wallet.component';
import { WalletInfoComponent } from './info/wallet.info.component'
import { MetaMaskService } from './services/metamask.service'

@NgModule({
    declarations: [
        WalletComponent,
        WalletInfoComponent,
    ],

    exports: [
        WalletComponent,
        WalletInfoComponent,
    ],

    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([
            {path: 'wallet', component: WalletComponent, canActivate: [AuthGuard] },
            {path: 'wallet-info', component: WalletInfoComponent}
        ])
    ],

    providers:[
        MetaMaskService
    ],
})

export class WalletModule {}