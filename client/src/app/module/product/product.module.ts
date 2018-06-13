import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from "@angular/router";
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductInputComponent } from './input/product.input.component'
import { StoryImageComponent } from './input/storyimage/story.image.component'
import { CopyrightComponent } from './input/copyright/copyright.component'
import { ProductEditComponent } from './edit/product.edit.component'
import { ProductDetailBuyComponent } from './product-detail/buy/product-detail.buy.component'
import { ProductDetailSellComponent } from './product-detail/sell/product-detail.sell.component'
import { ProductSalePriceComponent } from './product-detail/sell/price/product-sale.price.component'
import { ONLINE_AUCTION_SERVICES } from './service/services';
import { StarsComponent } from './stars/stars.component';
import { SearchComponent } from './search/search.component';
import { FootScrollBarComponent } from './scrollBar/scrollBar.component'
import { NgMasonryGridModule } from 'ng-masonry-grid';
import { WalletModule } from './../wallet/wallet.module';
import { ReviewComponent } from './review/review.component';

@NgModule({
    declarations: [
        ProductDetailComponent,
        ProductItemComponent,
        StarsComponent,
        SearchComponent,
        FootScrollBarComponent,
        ProductInputComponent,
        ProductEditComponent,
        StoryImageComponent,
        ProductDetailBuyComponent,
        ProductDetailSellComponent,
        ProductSalePriceComponent,
        CopyrightComponent,
        ReviewComponent
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
        WalletModule,
        RouterModule.forChild([
            {path: 'products/:productId', component: ProductDetailComponent},
            {path: 'products/:productId/edit', component: ProductEditComponent},
            {path: 'copyright', component: CopyrightComponent},
          ]),
    ],
    providers:[
        ...ONLINE_AUCTION_SERVICES
    ],
})

export class ProductModule { }