import { Injectable, Inject, OpaqueToken } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from 'rxjs';

export const STYLE_TRANSFER_SERVICE_URL = new OpaqueToken("style-transfer-url");
export const STYLE_TRANSFER_UPLOAD_SERVICE_URL = new OpaqueToken("style-transfer-upload-url")

@Injectable()
export class StyleTransferService {
    constructor(private http: Http,
        @Inject(STYLE_TRANSFER_SERVICE_URL) private transferurl : string,
        @Inject(STYLE_TRANSFER_UPLOAD_SERVICE_URL) private uploadurl : string) {
        }

    transfer(content : string, style : string) : Observable<string> {
        let contentQueryParams = "content=" + content;
        let styleQueryParams = "style=" + style;
        let outputQueryParams = "output=" + "";

        return this.http.get(this.transferurl + "?" + contentQueryParams + "&" + styleQueryParams + 
            "&" + "iterations=10").map(response => response.json());
    }

    preview(content : string, style : string): string {
        let previewURL = this.transferurl + "/preview"
        let contentQueryParams = "content=" + btoa(content);
        let styleQueryParams = "style=" + btoa(style);
        
        var outputFile : string;

        return "";
    }

    contentUploadURL() : string {
        return this.uploadurl + "/content";
    }

    styleUploadURL() : string {
        return this.uploadurl + "/style";
    }

    uploadContent(files : Array<File>) {
        return this.uploadFile(this.uploadurl + "/content", files);
    }

    uploadStyle(files : Array<File>) {
        return this.uploadFile(this.uploadurl + "/style", files);
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