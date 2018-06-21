import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

import { UserService, USER_SERVICE_URL, SOCIAL_SERVICE_URL } from './service/user.service'
import { UserProfileComponent } from './profile/user.profile.component'
import { UserMainComponent } from './main/user.main.component'
import { ConcernUsersComponent } from './concern/users/user.concernusers.component'
import { UserProductsComponent } from './products/user.products.component'
import { UserProductItemComponent } from './products/item/user.product.item.component'
import { ConcernProductsComponent } from './concern/products/user.concernprods.component'
import { ConcernUserComponent } from './concern/users/user/user.concernuser.component'
import { UserWalletComponent } from './wallet/user.wallet.component'

import { AuthGuard } from './../../interceptor/auth.guard';
import { OrderModule } from './../order/order.module'
import { NgMasonryGridModule } from 'ng-masonry-grid';

@NgModule({
    declarations: [
        UserProfileComponent,
        UserMainComponent,
        ConcernUserComponent,
        ConcernUsersComponent,
        UserProductsComponent,
        ConcernProductsComponent,
        UserWalletComponent,
        UserProductItemComponent,
    ],
    exports: [
        UserProfileComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        OrderModule,
        NgMasonryGridModule,
        RouterModule.forChild([
            {path: 'users/:username', component: UserMainComponent, canActivate: [AuthGuard]}
          ]),
    ],

    providers:[
        UserService,
        { provide: USER_SERVICE_URL, useValue: environment.productionURL + "/api/v1" },
        { provide: SOCIAL_SERVICE_URL, useValue: environment.socialURL},
    ],
})

export class UserModule { }