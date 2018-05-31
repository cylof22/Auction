import { Injectable, InjectionToken, Injector } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Md5 } from 'ts-md5/dist/md5'

import { Product } from './../../product/product.model/product';
import { UserInfo, ConcernedUser, Wallet, UpdateInfo } from './../user.model/user'
export const USER_SERVICE_URL = new InjectionToken<string>("user-service-url");

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  private userURL : string;

  constructor(private http: HttpClient, injector : Injector) {
    this.userURL = injector.get(USER_SERVICE_URL);
  }

  encode(name: string, password: string) : string {
    let res = Md5.hashStr(name + Md5.hashStr(password).toString());
    return res.toString();
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

  updateUserInfo(userId: string, newInfo: UpdateInfo): Observable<string> {
    return this.http.post<string>(this.userURL + `/users/${userId}/update`, newInfo);
  }
}
