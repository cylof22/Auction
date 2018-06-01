import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from './../../../environments/environment';
import { OrderBuyerComponent } from './buyer/order.buyer.component'
import { OrderSellerComponent } from './seller/order.seller.component'
import { OrderItemComponent } from './item/order.item.component'
import { OrderStatusComponent } from './status/order.status.component'
import { ShopComponent } from './shop/shop.component'
import { ShopItemComponent } from './shop/item/shop.item.component'
import { OrderService, API_ORDER_SERVICE_URL } from './service/order.service'

import { NgMasonryGridModule } from 'ng-masonry-grid';

@NgModule({
    declarations: [
        OrderBuyerComponent,
        OrderItemComponent,
        OrderStatusComponent,
        OrderSellerComponent,
        ShopComponent,
        ShopItemComponent,
    ],
    exports: [
        OrderBuyerComponent,
        OrderSellerComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgMasonryGridModule,
        RouterModule.forChild([
            {path: 'shop', component: ShopComponent},
            {path: 'shop/:orderId', component: ShopItemComponent},
          ]),
    ],

    providers:[
        OrderService,
        {provide: API_ORDER_SERVICE_URL, useValue: environment.productionURL},
    ],
})

export class OrderModule { }