import { Component } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from "ng2-file-upload";
import { StyleTransferService } from '../services/style.service';
import { Router } from '@angular/router';
import { StyleCustomComponent } from '../style.custom/style.custom.component';
import { StyleArtistComponent } from '../style.artist/style.artist.component';

@Component({
    selector: 'style-transfer',
    templateUrl: './style.transfer.component.html',
    styleUrls: ['./style.transfer.component.css']
})
export class StyleTransferComponent {
    contentFile : Array<File>;

    contentImageURL: string;

    activatedStyleComponent : any;

    selectedStyleURL : string;

    modelVisible = false;
    
    constructor(private svc : StyleTransferService,
        public route:Router) {
    }

    OnContentChange(input) {
        this.contentFile = input.files;

        // show preview
        this.showImage(input, "imagePreview");
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

    onRouterOutletActivate(component) {
        this.activatedStyleComponent = component;
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
        if(this.activatedStyleComponent instanceof StyleCustomComponent) {
            let styleTransferComp = this.activatedStyleComponent as StyleCustomComponent;
            // transfer the content image by the style image
            this.svc.transfer(this.contentImageURL, styleTransferComp.getSelectedStyle()).subscribe(res => {
                this.showComputeRes(res);
            }); 
        } else {
            let artistTransferComp = this.activatedStyleComponent as StyleArtistComponent;
            // transfer the content image by the artist type
            this.svc.transferByArtist(this.contentImageURL,  artistTransferComp.getSelectedArtistModel()).subscribe( res => {
                this.showComputeRes(res);
            })
        }
        
    }

    Transfer(event) { 
        // Upload the content file
        this.uploadContent();
    }

    showComputeRes(output: Blob) {
        let reader = new FileReader();
        reader.readAsDataURL(output);
        reader.onload = function(e) {
            let img = document.getElementById("computedRes");
            img.setAttribute("src", this.result);
        }

        reader.onloadend = () => {
            this.modelVisible = true;
        }
    }

    hideComputeRes() {
        let img = document.getElementById("computedRes");
        img.setAttribute("src", "");

        this.modelVisible = false;
    }

    prepareToUpload() {
        let img = document.getElementById("computedRes");
        let outfileData = img.getAttribute("src");

        // hide dialog
        this.hideComputeRes();

        let paras = {
            "url":outfileData,
            "basedUrl": this.selectedStyleURL
        }

        this.route.navigate(["/style-upload", paras])
    }
}