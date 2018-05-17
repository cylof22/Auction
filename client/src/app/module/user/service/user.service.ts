import { Injectable, InjectionToken, Injector } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Product } from './../../product/product.model/product';
import { UserInfo, ConcernedUser, Wallet } from './../user.model/user'
export const USER_SERVICE_URL = new InjectionToken<string>("user-service-url");

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  private userURL : string;

  constructor(private http: HttpClient, injector : Injector) {
    this.userURL = injector.get(USER_SERVICE_URL);
  }

  getUserInfo(userId: string): Observable<UserInfo> {
      return this.http.get<UserInfo>(this.userURL + `/users/${userId}`);
  }
  getConcernedProducts(userId: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.userURL + `/users/${userId}/concernedProducts`);
  }

  getConcernedUsers(userId: string): Observable<ConcernedUser[]> {
    return this.http.get<ConcernedUser[]>(this.userURL + `/users/${userId}/concernedUsers`);
  }

  getWalletInfo(userId: string): Observable<Wallet> {
    return this.http.get<Wallet>(this.userURL + `/users/${userId}/wallet`);
  }
}
