import { Component } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";
import { StyleTransferService } from '../services/style.service';
import { Product } from '../../product/product.model/product'
import { ProductService } from '../../product/service/product.service'

@Component({
    selector: 'style-transfer',
    templateUrl: './style.transfer.component.html',
})
export class StyleTransferComponent {
    contentFile : Array<File>;
    contentData : any;
    contentUploader : FileUploader;

    styleFile : Array<File>;
    styleData : any;
    styleUploader : FileUploader;

    outputFile : string;
    products: Product[];

    constructor(private svc : StyleTransferService) {

        let contentURL = this.svc.contentUploadURL();
        this.contentUploader = new FileUploader({
            url: contentURL,
            method: "POST",
            itemAlias: "uploadContentfile"
        });
        this.contentUploader.onSuccessItem = (item, response, status, headers) => this.OnContentUploadSucess;

        let styleURL = this.svc.styleUploadURL();
        this.styleUploader = new FileUploader({
            url : styleURL,
            method: "POST",
            itemAlias: "uploadStyleFile"
        });
        this.styleUploader.onSuccessItem = (item, response, status, headers) => this.OnStyleUploadSucess;
    }

    OnContentUploadSucess(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {

    }

    OnStyleUploadSucess(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) { 

    }

    OnContentChange(event) {
        this.contentFile = event.target.files;
        this.handleFiles(event.target.files, "content-preview");
    }

    OnStyleChange(event) {
        this.styleFile = event.target.files;
        this.handleFiles(event.target.files, "style-preview");
    }

    private handleFiles(files, previewID) {
        var preview = document.getElementById(previewID);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            
            if (!file.type.startsWith('image/')){ continue }
            
            var img = document.createElement("img");
            img.className = "img-responsive";
            preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
            
            var reader = new FileReader();
            reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
            reader.readAsDataURL(file);
        }
    }

    uploadContent() {
        this.contentUploader.options.url += "/" + this.contentFile;
        this.contentUploader.queue[0].onSuccess = function (response, status, headers) {
            if (status == 200) {
                let contentRes = JSON.parse(response);
            } else {

                alert("");
            }
        };
        this.contentUploader.queue[0].upload();
    }

    uploadStyle() {
        this.styleUploader.options.url += "/" + this.styleFile;
        this.styleUploader.queue[0].onSuccess = function( response, status, headers) {
            if (status == 200) {
                let styleRes = JSON.parse(response);

            } else {
                alert("");
            }
        };
        this.styleUploader.queue[0].upload();
    }
    
    Transfer(event) {
        // Upload the content file
        var uploadedContentFile : string;
        this.contentUploader.uploadAll();
        this.contentUploader.onSuccessItem = (item, response, status, headers) => {
            let contentRes = JSON.parse(response)
            uploadedContentFile = contentRes["output"]

            var uploadStyleFile : string;
            this.styleUploader.uploadAll();
            this.styleUploader.onSuccessItem = (item, response, status, headers) => {
                let styleRes = JSON.parse(response)
                uploadStyleFile = styleRes["output"]

                // transfer the content image by the style image
                this.svc.transfer(uploadedContentFile, uploadStyleFile).subscribe(output => {
                    let transferRes = JSON.parse(output)
                    this.outputFile = transferRes["output"];
                });
            };
        };
    }

    updateSelecedImage(url: string) {
        let img = document.getElementById("selectedStyle");
        img.setAttribute("src", url);
    }
}