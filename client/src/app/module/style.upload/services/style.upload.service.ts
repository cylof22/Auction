import { Injectable, Inject, OpaqueToken } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
export const STYLE_API_UPLOAD_SERVICE_URL = new OpaqueToken("style-upload-url");
import { Product } from '../../product/product.model/product'

@Injectable()
export class StyleUploadService {
    constructor(private http: HttpClient,
        @Inject(STYLE_API_UPLOAD_SERVICE_URL) private url : string) {
        }

    uploadData(postedData : any) : Observable<Product> {

        let body = postedData;
        return this.http.post<Product>(this.url, body);
    }
}