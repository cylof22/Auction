import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Order } from './../order.model/order'

import 'rxjs/add/operator/map';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient) {}

  getOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`/api/orders/${userId}`);
  }

  getCancelledOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`/api/orders/cancel/${userId}`);
  }

  confirmOrderByBuyer(orderId: string): Observable<string> {
      return this.http.get<string>('/api/order/${orderId}/confirm');
  } 

  cancelOrderByBuyer(orderInfo: any): Observable<string> {
    let body = orderInfo;
    return this.http.post<string>('/api/order/${orderId}/requirecancel', body);
  } 

  // buyer ships returned product
  shipReturnByBuyer(orderId: string, expressInfo: any): Observable<string> {
    return this.http.post<string>('/api/order/${orderId}/applyreturn', expressInfo);
  } 

  agreeReturnBySeller(order: string): Observable<string> {
    return this.http.get<string>('/api/order/${orderId}/agreereturn');
  }

  confirmReturnBySeller(order: string): Observable<string> {
    return this.http.get<string>('/api/order/${orderId}/confirmreturn');
  }

  shipProductBySeller(orderId: string, expressInfo: any): Observable<string> {
    return this.http.post<string>('/api/order/${orderId}/ship', expressInfo);
  }
}
