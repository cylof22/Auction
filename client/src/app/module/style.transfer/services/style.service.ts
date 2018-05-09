import { Injectable, Injector, InjectionToken } from "@angular/core";
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
export const STYLE_TRANSFER_SERVICE_URL = new InjectionToken<string>('style-transfer-url');
export const STYLE_TRANSFER_BY_ARTIST_SERVICE_URL = new InjectionToken<string>('style-transfer-by-artist-url');
export const STYLE_TRANSFER_UPLOAD_SERVICE_URL = new InjectionToken<string>('style-transfer-upload-url')
import { Product } from '../../product/product.model/product'

@Injectable()
export class StyleTransferService {
    private transferURL : string;
    private transferByArtistURL : string;
    private uploadurl : string;

    constructor(private http: HttpClient,
        injector: Injector) {
            this.transferURL = injector.get(STYLE_TRANSFER_SERVICE_URL);
            this.transferByArtistURL = injector.get(STYLE_TRANSFER_BY_ARTIST_SERVICE_URL);
            this.uploadurl = injector.get(STYLE_TRANSFER_UPLOAD_SERVICE_URL);
        }

    transfer(content : string, style : string): Observable<Blob> {
        let contentQueryParams = "content=" + btoa(content);
        let styleQueryParams = "style=" + btoa(style);

        return this.http.get(this.transferURL + "?" + contentQueryParams + "&" + styleQueryParams + 
            "&" + "iterations=100", { responseType: 'blob' });
    }

    transferByArtist(contentURL : string, artist : string) : Observable<Blob> {
        let contentQueryParams = "content=" + btoa(contentURL);
        let artistQueryParams = "artist=" + artist;
        return this.http.get(this.transferByArtistURL + "?" + contentQueryParams + 
            "&" + artistQueryParams, { responseType: 'blob' });
    }
    
    preview(content : string, style : string): Observable<string> {
        let previewURL = this.transferURL + "/preview"
        let contentQueryParams = "content=" + btoa(content);
        let styleQueryParams = "style=" + btoa(style);
        
        var outputFile : string;

        return this.http.get<string>(previewURL + "?" + contentQueryParams + "&" + styleQueryParams);
    }

    contentUploadURL() : string {
        return this.uploadurl + "/content";
    }

    styleUploadURL() : string {
        return this.uploadurl + "/style";
    }
    
    uploadContent(postedData : any) : Observable<Product> {

        let body = postedData;

        return this.http.post<Product>(this.uploadurl + "/content", body);
    }

    private uploadFile(url : string, files: Array<File>) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            formData.set("enctype", "multipart/form-data");
            var xhr = new XMLHttpRequest();
            for(var i = 0; i < files.length; i++) {
                formData.append("files", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }
}