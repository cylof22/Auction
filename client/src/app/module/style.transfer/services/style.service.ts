import { Injectable, Inject, OpaqueToken } from "@angular/core";
import { FileUploadModule } from 'ng2-file-upload';
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

    contentUploadURL() : string {
        return this.url + "/content";
    }

    styleUploadURL() : string {
        return this.url + "/style";
    }

    uploadContent(files : Array<File>) {
        return this.uploadFile(this.url + "/content", files);
    }

    uploadStyle(files : Array<File>) {
        return this.uploadFile(this.url + "/style", files);
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