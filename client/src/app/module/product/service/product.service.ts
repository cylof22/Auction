import {EventEmitter, Inject, Injectable, OpaqueToken} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {Product} from '../product.model/product';
import {Review} from '../product.model/review';

import 'rxjs/add/operator/map';
export const API_PRODUCTS_SERVICE_URL = new OpaqueToken("api-products-url");

export interface ProductSearchParams {
  title: string;
  minPrice: number;
  maxPrice: number;
}

@Injectable()
export class ProductService {
  searchEvent: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient,
    @Inject(API_PRODUCTS_SERVICE_URL) private apiUrl : string,
  ) {
  }

  search(params: ProductSearchParams): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/api/products', {params: encodeParams(params)});
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/api/products');
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(this.apiUrl + `/api/products/${productId}`);
  }

  getReviewsForProduct(productId: number): Observable<Review[]> {
    return this.http
    .get<Review[]>(this.apiUrl + `/api/products/${productId}/reviews`)
    .map(reviews => reviews.map(
      (r: any) => new Review(r.id, r.productId, new Date(r.timestamp), r.user, r.rating, r.comment)));

  }

  getAllCategories(): string[] {
    return ['风景', '人物', '油画'];
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
