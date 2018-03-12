import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from "@angular/router";
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ONLINE_AUCTION_SERVICES } from './service/services';
import { StarsComponent } from './stars/stars.component';
import { SearchComponent } from './search/search.component';

@NgModule({
    declarations: [
        ProductDetailComponent,
        ProductItemComponent,
        StarsComponent,
        SearchComponent,
    ],
    exports: [
        ProductDetailComponent,
        ProductItemComponent,
        StarsComponent,
        SearchComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([
            {path: 'products/:productId', component: ProductDetailComponent},
          ]),
    ],
    providers:[
        ...ONLINE_AUCTION_SERVICES
    ],
})

export class ProductModule { }