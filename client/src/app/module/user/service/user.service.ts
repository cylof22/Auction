import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Product } from './../../product/product.model/product';
import { UserInfo, ConcernedUser, Wallet } from './../user.model/user'

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  getUserInfo(userId: string): Observable<UserInfo> {
      return this.http.get<UserInfo>('/api/users/${userId}/userInfo');
  }
  getConcernedProducts(userId: string): Observable<Product[]> {
    return this.http.get<Product[]>('/api/users/${userId}/concernedProducts');
  }

  getConcernedUsers(userId: string): Observable<ConcernedUser[]> {
    return this.http.get<ConcernedUser[]>(`/api/users/${userId}/concernedUsers`);
  }

  getWalletInfo(userId: string): Observable<Wallet> {
    return this.http.get<Wallet>(`/api/users/${userId}/wallet`);
  }

  buy(productId: string) {

  }
}
