import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderBuyerComponent } from './buyer/order.buyer.component'
import { OrderSellerComponent } from './seller/order.seller.component'
import { OrderItemComponent } from './item/order.item.component'
import { OrderStateComponent } from './state/order.state.component'
import { OrderService } from './service/order.service'

@NgModule({
    declarations: [
        OrderBuyerComponent,
        OrderItemComponent,
        OrderStateComponent,
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
    ],
})

export class OrderModule { }