import { Injectable, Injector, InjectionToken } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
export const STYLE_API_UPLOAD_SERVICE_URL = new InjectionToken<string>("style-upload-url");
import { Product } from '../../product/product.model/product'

@Injectable()
export class StyleUploadService {
    private url : string;

    constructor(private http: HttpClient, injector : Injector) {
            this.url = injector.get(STYLE_API_UPLOAD_SERVICE_URL);
    }

    uploadData(postedData : any) : Observable<Product> {
        let body = postedData;
        return this.http.post<Product>(this.url + "/style", body);
    }

    batchUpload(postedData : any) : Observable<string> {
        let body = postedData;
        return this.http.post<string>(this.url + "/styles", body);
    }
}