import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from "@angular/router";
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductInputComponent } from './input/product.input.component'
import { ProductEditComponent } from './edit/product.edit.component'
import { ONLINE_AUCTION_SERVICES } from './service/services';
import { StarsComponent } from './stars/stars.component';
import { SearchComponent } from './search/search.component';
import { FootScrollBarComponent } from './scrollBar/scrollBar.component'
import { NgMasonryGridModule } from 'ng-masonry-grid';

@NgModule({
    declarations: [
        ProductDetailComponent,
        ProductItemComponent,
        StarsComponent,
        SearchComponent,
        FootScrollBarComponent,
        ProductInputComponent,
        ProductEditComponent,
    ],
    exports: [
        ProductDetailComponent,
        ProductItemComponent,
        ProductInputComponent,
        StarsComponent,
        SearchComponent,
        FootScrollBarComponent,
        NgMasonryGridModule,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([
            {path: 'products/:productId', component: ProductDetailComponent},
            {path: 'products/:productId/edit', component: ProductEditComponent},
          ]),
    ],
    providers:[
        ...ONLINE_AUCTION_SERVICES
    ],
})

export class ProductModule { }