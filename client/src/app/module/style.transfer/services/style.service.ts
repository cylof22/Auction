import { Injectable, Inject, OpaqueToken } from "@angular/core";
import { Http } from "@angular/http";

export const STYLE_TRANSFER_SERVICE_URL = new OpaqueToken("style-transfer-url");

@Injectable()
export class StyleTransferService {
    constructor(private http: Http, 
        @Inject(STYLE_TRANSFER_SERVICE_URL) private url : string) {
    }

    transfer(content : string, style : string) : string {
        let contentQueryParams = "content=" + content;
        let styleQueryParams = "style=" + style;
        let outputQueryParams = "output=" + "";
        this.http.get(this.url + "?" + contentQueryParams + "&" + styleQueryParams + "&" + 
            outputQueryParams + "&" + "iterations=100").map(response => response.json());

        return "";
    }

    preview(content : string, style : string): string {
        let previewURL = this.url + "/preview"
        let contentQueryParams = "content=" + content;
        let styleQueryParams = "style=" + style;
        let outputQueryParams = "output=" + "";
        this.http.get(previewURL + "?" + contentQueryParams + "&" + styleQueryParams + "&" + 
            outputQueryParams).map(response => response.json())

        return "";
    }
}