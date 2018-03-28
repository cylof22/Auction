import { Injectable, Inject, OpaqueToken } from "@angular/core";
import { Http,Response,RequestOptions,Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
export const STYLE_API_UPLOAD_SERVICE_URL = new OpaqueToken("style-upload-url");
import { Product } from '../../product/product.model/product'

@Injectable()
export class StyleUploadService {
    constructor(private http: Http,
        @Inject(STYLE_API_UPLOAD_SERVICE_URL) private url : string) {
        }

    uploadData(postedData : any) : Observable<Product> {

        let body = postedData;
        //let header=new Headers({'Content-Type':'application/json'});
        //let opt=new RequestOptions({headers:header});

        return this.http.post(this.url, body)
        .map(response => response.json());

        //return this.http.post("http://127.0.0.1:8000/upload",body,option).map((res:Response)=>res.json());
    }
}