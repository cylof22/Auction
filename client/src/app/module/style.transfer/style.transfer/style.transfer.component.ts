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

    contentImageURL: string;
    outputFile : string;
    styles: Product[];
    defaultStyleURL : string;
    selectedStyle: Product;
    modelVisible = false;

    constructor(private svc : StyleTransferService,
        private productService: ProductService,
        public route:Router) {

        this.productService.getProducts()
        .subscribe(
            params => { 
                this.styles = params;
                this.defaultStyleURL = this.styles[0].url;
            }
      );
    }

    OnContentUploadSucess(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {

    }

    OnStyleUploadSucess(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) { 

    }

    OnContentChange(input) {
        this.contentFile = input.files;

        // show preview
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
            img.style.width = "auto";
            img.setAttribute("src", this.result);
        }
    }

    uploadContent() {
        // get image data
        let img = document.getElementById("imagePreview");
        let uploadedData = {
            "url": img.getAttribute("src")
        }
        
        this.svc.uploadContent(uploadedData).subscribe( result =>  {
            this.contentImageURL = result.url;
            this.doTransfer()
        });  
    }

    doTransfer()
    {
        // transfer the content image by the style image
        this.svc.transfer(this.contentImageURL, this.selectedStyle.url).subscribe(res => {
            this.outputFile = res["output"];
            this.showComputeRes(this.outputFile);
        }); 
    }

    Transfer(event) { 
        // Upload the content file
        this.uploadContent();
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