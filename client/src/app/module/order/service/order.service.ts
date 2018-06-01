import { Injectable, Injector, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Order, SellInfo, BuyInfo, Express } from './../order.model/order'

import 'rxjs/add/operator/map';

export const API_ORDER_SERVICE_URL = new InjectionToken<string>("api-order-url");

export interface OrderSearchParams {
  productId: string;
}

@Injectable()
export class OrderService {
  private apiUrl: string;

  constructor(private http: HttpClient, injector : Injector) {
    this.apiUrl = injector.get(API_ORDER_SERVICE_URL);
  }

  getOrderByProductId(productId: string): Observable<Order> {
    let params = {'productId': productId};
    return this.http.get<Order>(this.apiUrl + '/api/v1/order', {params: encodeParams(params)});
  }

  getOrdersInTransaction(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl + `/api/v1/transactionorders`);
  }

  getMyOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl + `/api/v1/orders/${userId}`);
  }

  getMySellings(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl + `/api/v1/sellings/${userId}`);
  }

  sell(sellInfo: SellInfo): Observable<string> {
    return this.http.post<string>(this.apiUrl + `/api/v1/order/create`, sellInfo);
  }

  cancelOrderBySeller(orderId: string): Observable<string> {
    return this.http.get<string>(this.apiUrl + `/api/v1/orders/${orderId}/delete`);
  }

  buy(orderId: string, buyInfo: BuyInfo): Observable<string> {
    return this.http.post<string>(this.apiUrl + `/api/v1/orders/${orderId}/buy`, buyInfo);
  }

  shipProductBySeller(orderId: string, expressInfo: Express): Observable<string> {
    return this.http.post<string>(this.apiUrl + `/api/v1/orders/${orderId}/productship`, expressInfo);
  }

  confirmOrderByBuyer(orderId: string): Observable<string> {
      return this.http.get<string>(this.apiUrl + `/api/v1/orders/${orderId}/confirm`);
  } 

  cancelOrderByBuyer(orderId: string, orderInfo: any): Observable<string> {
    let body = orderInfo;
    return this.http.post<string>(this.apiUrl + `/api/v1/orders/${orderId}/askreturn`, body);
  } 

  agreeReturnBySeller(orderId: string): Observable<string> {
    return this.http.get<string>(this.apiUrl + `/api/v1/orders/${orderId}/returnagreed`);
  }

  // buyer ships returned product
  shipReturnByBuyer(orderId: string, expressInfo: any): Observable<string> {
    return this.http.post<string>(this.apiUrl + `/api/v1/orders/${orderId}/returnship`, expressInfo);
  } 

  confirmReturnBySeller(orderId: string): Observable<string> {
    return this.http.get<string>(this.apiUrl + `/api/v1/orders/${orderId}/returnconfirmed`);
  }

  testSystemConfirm(orderId: string, res: any): Observable<string> {
    return this.http.post<string>(this.apiUrl + `/api/v1/orders/${orderId}/chainconfirm`, res);
  }

  testSystemCancel(orderId: string, res: any): Observable<string> {
    return this.http.post<string>(this.apiUrl + `/api/v1/orders/${orderId}/chaincancel`, res);
  }
}


/**
 * Encodes the object into a valid query string.
 */
function encodeParams(params: any): HttpParams {
  return Object.getOwnPropertyNames(params)
    .reduce((p, key) => 
      p.append(key, params[key]),new HttpParams());
}