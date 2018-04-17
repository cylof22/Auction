import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ProductModule } from './module/product/product.module';
import { StyleTransferModule } from './module/style.transfer/style.transfer.module';
import { WalletModule } from './module/wallet/wallet.module';
import { StyleUploadModule } from './module/style.upload/style.upload.module';
import { ArtistModule } from './module/artist/artist.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    CarouselComponent,
  ],
  imports: [
    ProductModule,
    StyleTransferModule,
    StyleUploadModule,
    WalletModule,
    ArtistModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '',                    component: HomeComponent},
    ])
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
