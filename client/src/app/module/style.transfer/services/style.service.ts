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

    transfer(contentFile : File, style : string): Observable<Blob> {
        let styleQueryParams = "style=" + btoa(style);

        let transferURL = this.transferURL + "?" + styleQueryParams + "&" + "iterations=100";
        const formData = new FormData();
        formData.append('content', contentFile);

        const formHeaders = { 'enctype': 'multipart/form-data', 'timeout': '200000'};
        return this.http.post(transferURL, formData, {headers: formHeaders, responseType: 'blob'})
    }

    transferByArtist(artist : string, contentFile: File) : Observable<Blob> {
        let transferURL = this.transferByArtistURL + "/" + artist;
        
        const formData = new FormData();
        formData.append('content', contentFile);

        const formHeaders = { 'enctype': 'multipart/form-data'};
        return this.http.post(transferURL, formData, {headers: formHeaders, responseType: 'blob'})
    }
    
    preview(content : string, style : string): Observable<string> {
        let previewURL = this.transferURL + "/preview"
        let contentQueryParams = "content=" + btoa(content);
        let styleQueryParams = "style=" + btoa(style);
        
        var outputFile : string;

        return this.http.get<string>(previewURL + "?" + contentQueryParams + "&" + styleQueryParams);
    }
}