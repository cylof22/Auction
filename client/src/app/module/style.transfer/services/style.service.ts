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
            outputQueryParams).map(response => response.json());
        
        return "";
    }

    uploadContent(contentName : string, file : any) {
        return this.uploadFile(this.url + "/content", contentName, file);
    }

    uploadStyle(styleName : any, file : any) {
        return this.uploadFile(this.url + "/style", styleName, file);
    }

    private uploadFile(url : string, name : string, file : any) : string {
        var uploadedName : string;
        var imgBody : any;
        var reader = new FileReader();
        reader.onload = function(evt : any) {
            imgBody = evt.target.result;
        };
        reader.readAsBinaryString(file);

        const requestData = {
            name : name,
            image: imgBody,
        };

        this.http.post(url, requestData).subscribe(
            res => {
                uploadedName = res.json()["name"];
            }
        );

        return uploadedName;
    }
}