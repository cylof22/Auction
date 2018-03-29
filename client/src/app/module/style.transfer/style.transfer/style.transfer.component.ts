import { Component } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";
import { StyleTransferService } from '../services/style.service';
import { Product } from '../../product/product.model/product'
import { ProductService } from '../../product/service/product.service'
import { Router } from '@angular/router';

@Component({
    selector: 'style-transfer',
    templateUrl: './style.transfer.component.html',
    styleUrls: ['./style.transfer.component.css']
})
export class StyleTransferComponent {
    contentFile : Array<File>;
    contentData : any;
    contentUploader : FileUploader;

    outputFile : string;
    styles: Product[];
    selectedStyle: Product;
    modelVisible = false;

    constructor(private svc : StyleTransferService,
        private productService: ProductService,
        public route:Router) {

        let contentURL = this.svc.contentUploadURL();
        this.contentUploader = new FileUploader({
            url: contentURL,
            method: "POST",
            itemAlias: "uploadContentfile"
        });
        this.contentUploader.onSuccessItem = (item, response, status, headers) => this.OnContentUploadSucess;

        this.productService.getProducts()
        .subscribe(
            params => this.styles = params,
            error => console.error(error)
      );
    }

    OnContentUploadSucess(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {

    }

    OnStyleUploadSucess(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) { 

    }

    OnContentChange(input) {
        this.contentFile = input.files;

        // update image path
        let imgPathText = document.getElementById("imagePath");
        imgPathText.innerText = input.value;

        this.showImage(input, "imagePreview");
    }

    OnStyleChange(style: Product) {
        this.selectedStyle = style;

        let img = document.getElementById("selectedStyle");
        img.setAttribute("src", style.url);
    }

    private showImage(input, previewID) {
        let reader = new FileReader();
        let file = input.files[0];
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            let img = document.getElementById(previewID);
            img.style.height = "100%";
            img.setAttribute("src", this.result);
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
    
    Transfer(event) { 
        // Upload the content file
        var uploadedContentFile : string;
        this.contentUploader.uploadAll();
        this.contentUploader.onSuccessItem = (item, response, status, headers) => {
            let contentRes = JSON.parse(response)
            uploadedContentFile = contentRes["output"]

            // get absolut path for compute
            var uploadStyleFile = "Server\\build\\Data\\Styles\\" + this.selectedStyle.id + ".png";

            // transfer the content image by the style image
            this.svc.transfer(uploadedContentFile, uploadStyleFile).subscribe(output => {
                let transferRes = JSON.parse(output)
                this.outputFile = transferRes["output"];

                this.showComputeRes(this.outputFile);
            });
        };
    }

    showComputeRes(resUrl: string) {
        let img = document.getElementById("computedRes");
        img.setAttribute("src", resUrl);

        this.modelVisible = true;
    }

    hideComputeRes() {
        let img = document.getElementById("computedRes");
        img.setAttribute("src", "");

        this.modelVisible = false;
    }

    prepareToUpload() {
        // hide dialog
        this.hideComputeRes();

        // get image urls
        if (this.selectedStyle == undefined)
            this.selectedStyle = this.styles[0];
        let paras = {
            "url":this.outputFile,
            "basedUrl": this.selectedStyle.url
        }

        this.route.navigate(["/style-upload", paras])
    }
}