import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserService } from './service/user.service'
import { UserProfileComponent } from './profile/user.profile.component'
import { UserMainComponent } from './main/user.main.component'
import { ConcernUsersComponent } from './concern/users/user.concernusers.component'
import { UserProductsComponent } from './products/user.products.component'
import { ConcernProductsComponent } from './concern/products/user.concernprods.component'
import { ConcernUserComponent } from './concern/users/user/user.concernuser.component'
import { UserWalletComponent } from './wallet/user.wallet.component'

import { AuthGuard } from './../../interceptor/auth.guard';
import { OrderModule } from './../order/order.module'
import { ProductModule } from './../product/product.module';

@NgModule({
    declarations: [
        UserProfileComponent,
        UserMainComponent,
        ConcernUserComponent,
        ConcernUsersComponent,
        UserProductsComponent,
        ConcernProductsComponent,
        UserWalletComponent,
    ],
    exports: [
        UserProfileComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ProductModule,
        OrderModule,
        RouterModule.forChild([
            {path: 'users/:username', component: UserMainComponent, canActivate: [AuthGuard]}
          ]),
    ],

    providers:[
        UserService,
    ],
})

export class UserModule { }