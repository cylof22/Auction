import {EventEmitter, Injector, Injectable, InjectionToken} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Product, UploadProduct } from '../product.model/product';
import { Review } from '../product.model/review';

import 'rxjs/add/operator/map';
export const API_PRODUCTS_SERVICE_URL = new InjectionToken<string>("api-products-url");
export const API_SEARCH_SERVICE_URL = new InjectionToken<string>("api-search-url");

export interface ProductSearchParams {
  title: string;
  owner: string;
}

@Injectable()
export class ProductService {
  searchEvent: EventEmitter<any> = new EventEmitter();
  private apiProductsUrl : string;
  private apiSearchUrL: string;

  constructor(private http: HttpClient, injector : Injector) {
    this.apiProductsUrl = injector.get(API_PRODUCTS_SERVICE_URL);
    this.apiSearchUrL = injector.get(API_SEARCH_SERVICE_URL);
  }

  search(queryParams: any): Observable<Product[]> {
    // add the params as query paramters
    return this.http.get<Product[]>(this.apiSearchUrL, {params: queryParams});
  }
  
  getProductsByUser(usrid: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiProductsUrl + `/user/${usrid}`)
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiProductsUrl);
  }

  getProductsByHotest(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiProductsUrl + "/hotest");
  }
  
  getProductsByTag(tag: string) : Observable<Product[]> {
    return this.http.get<Product[]>(this.apiProductsUrl + `/tags/${tag}`);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(this.apiProductsUrl + `/${productId}`);
  }

  getReviewsForProduct(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiProductsUrl + `/${productId}/reviews`);

  }

  updateProduct(productId: string, productData: UploadProduct): Observable<string> {
    return this.http.post<string>(this.apiProductsUrl + "/" + productId + "/update", productData);
  }

  deleteProduct(productId: string): Observable<string> {
    return this.http.get<string>(this.apiProductsUrl + "/" + productId + "/delete");
  }

  getAllTags(): string[] {
    return ['Landscape', 'Figure Painting', 'Oil Painting'];
  }

  getSearchTypes(): string[] {
    return ['Tag', 'Owner', 'Maker', 'Title'];
  }

  getPoundage(price) : number{
    let intPrice = parseInt(price);
    return (intPrice / 100);
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
