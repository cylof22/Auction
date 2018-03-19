import { Injectable, Inject, OpaqueToken } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
export const STYLE_TRANSFER_SERVICE_URL = new OpaqueToken("style-transfer-url");

@Injectable()
export class StyleTransferService {
    constructor(private http: Http,
        @Inject(STYLE_TRANSFER_SERVICE_URL) private url : string) {
        }

    transfer(content : string, style : string) : Observable<string> {
        let contentQueryParams = "content=" + btoa(content);
        let styleQueryParams = "style=" + btoa(style);
       
        var outputFile : string;

        return this.http.get(this.url + "?" + contentQueryParams + "&" + styleQueryParams + 
            "&" + "iterations=10").map(response => response.json());
    }

    preview(content : string, style : string): string {
        let previewURL = this.url + "/preview"
        let contentQueryParams = "content=" + content;
        let styleQueryParams = "style=" + style;
        
        var outputFile : string;

        this.http.get(previewURL + "?" + contentQueryParams + "&" + styleQueryParams).map(response => {
                let jsonbody = response.json();
                outputFile = jsonbody["output"];
            });
        
        return "";
    }

    uploadContent(contentName : string, file : any) {
        return this.uploadFile(this.url + "/content", contentName, file);
    }

    uploadStyle(styleName : any, file : any) {
        return this.uploadFile(this.url + "/style", styleName, file);
    }

    private uploadFile(url : string, name : string, file : any) : Observable<string> {
        var uploadedName : string;
        var imgBody : any;
        var reader = new FileReader();
        reader.onload = function(evt : any) {
            imgBody = evt.target.result;
        };
        reader.readAsBinaryString(file);

        const requestData = {
            image: imgBody,
        };

        return this.http.post(url + "/" + name, requestData)
            .map(res => res.json()).map(output => output["name"]);
    }
}