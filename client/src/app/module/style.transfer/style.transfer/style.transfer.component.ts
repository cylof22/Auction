import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
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
    @Input("ImgSrc") originalImgSrc: string = "";
    @Output() completeTransfer: EventEmitter<any> = new EventEmitter;

    @ViewChild(StyleArtistComponent) artistComponet : StyleArtistComponent;
    @ViewChild(StyleCustomComponent) customComponent : StyleCustomComponent;
    
    contentImageURL: string;

    selectedStyleURL : string;

    modelVisible = false;
    
    isArtistStyle = true;

    constructor(private svc : StyleTransferService,
        public route:Router) {
    }

    ngOnInit() {
        if (this.originalImgSrc != "") {

            let img = document.getElementById("resultPreview");
            img.style.width = "auto";
            img.setAttribute("src", this.originalImgSrc);

            this.modelVisible = true;
        }
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

    applyTransfer()
    {
        // get image data
        let img = document.getElementById("imagePreview");
        let uploadedData = {
            "url": img.getAttribute("src")
        }
        
        this.svc.uploadContent(uploadedData).subscribe( result =>  {
            this.contentImageURL = result.url;
            
            if(this.isArtistStyle) {
                // transfer the content image by the artist type
                this.svc.transferByArtist(this.contentImageURL,  this.artistComponet.getSelectedArtistModel()).subscribe( res => {
                    this.showComputeRes(res);
                })
            } else {
                // transfer the content image by the style image
                this.svc.transfer(this.contentImageURL, this.customComponent.getSelectedStyle()).subscribe(res => {
                    this.showComputeRes(res);
                }); 
            }
        });
    }

    Transfer(event) {
        // get image data
        let contentImg = document.getElementById("imagePreview");
        let contentImgData = contentImg.getAttribute("src");

        let resultImg = document.getElementById("resultPreview");
        resultImg.setAttribute("src", contentImgData);

        this.modelVisible = true;
    }

    showComputeRes(output: Blob) {
        let reader = new FileReader();
        reader.readAsDataURL(output);
        reader.onload = function(e) {
            let img = document.getElementById("resultPreview");
            img.setAttribute("src", this.result);
        }

        reader.onloadend = () => {
            this.modelVisible = true;
        }
    }

    hideTransferDlg() {
        let img = document.getElementById("resultPreview");
        img.setAttribute("src", "");

        this.modelVisible = false;
    }


    goToUpload() {
        let img = document.getElementById("resultPreview");
        let outfileData = img.getAttribute("src");

        // hide dialog
        this.hideTransferDlg();

        let result = {
            "url":outfileData,
            "basedUrl": this.selectedStyleURL
        }

        this.completeTransfer.emit(result);
    }

    cancel() {
        this.hideTransferDlg();
        this.completeTransfer.emit("");
    }

    OnSelectedCustom() {
        this.isArtistStyle = false;
    }

    OnSelectedArtist() {
        this.isArtistStyle = true;
    }
}