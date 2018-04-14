import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ProductModule } from './module/product/product.module';
import { StyleTransferModule } from './module/style.transfer/style.transfer.module';
import { WalletModule } from './module/wallet/wallet.module';
import { StyleUploadModule } from './module/style.upload/style.upload.module';
import { AuthenticationModule } from './module/authentication/authentication.module'
import { UserModule } from './module/user/user.module'
import { HeaderInterceptor } from './interceptor/header.interceptor'
import { ResponseInterceptor } from './interceptor/response.interceptor'

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
    AuthenticationModule,
    UserModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '',                    component: HomeComponent},
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi:true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi:true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
