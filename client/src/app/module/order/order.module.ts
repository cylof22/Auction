import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from './../../../environments/environment';
import { OrderBuyerComponent } from './buyer/order.buyer.component'
import { OrderSellerComponent } from './seller/order.seller.component'
import { OrderItemComponent } from './item/order.item.component'
import { OrderStatusComponent } from './status/order.status.component'
import { OrderService, API_ORDER_SERVICE_URL } from './service/order.service'

@NgModule({
    declarations: [
        OrderBuyerComponent,
        OrderItemComponent,
        OrderStatusComponent,
        OrderSellerComponent,
    ],
    exports: [
        OrderBuyerComponent,
        OrderSellerComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],

    providers:[
        OrderService,
        {provide: API_ORDER_SERVICE_URL, useValue: environment.productionURL},
    ],
})

export class OrderModule { }