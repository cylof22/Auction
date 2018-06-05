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
    @Input("ImgSrc") originalImgSrc: File = null;
    @Output() completeTransfer: EventEmitter<any> = new EventEmitter;

    @ViewChild(StyleArtistComponent) artistComponet : StyleArtistComponent;
    @ViewChild(StyleCustomComponent) customComponent : StyleCustomComponent;

    selectedStyleURL : string;

    modelVisible = false;
    
    isArtistStyle = true;

    constructor(private svc : StyleTransferService,
        public route:Router) {
    }

    ngOnInit() {
        if (this.originalImgSrc != null) {
            let reader = new FileReader();
            reader.readAsDataURL(this.originalImgSrc);
            reader.onload = function(e) {
                let img = document.getElementById("resultPreview");
                img.style.width = "auto";
                img.setAttribute("src", this.result);
            }

            this.modelVisible = true;
        }
    }

    applyTransfer(currentBtn: HTMLElement)
    {
        // change background color
        currentBtn.style.backgroundColor = 'cornflowerblue';
        currentBtn.style.color = 'white';
        currentBtn.style.border = 'none';

        // get image data
        let img = document.getElementById("imagePreview");

        // Todo: Need to parse the image data as the form data to the AI server
        // Todo: Merge the content upload process to the transfer request
        // Todo: Let the user to decide the final destination of the content image
     
        if(this.isArtistStyle) {
            // transfer the content image by the artist type
            this.svc.transferByArtist(this.artistComponet.getSelectedArtistModel(), this.originalImgSrc).subscribe( res => {
                this.showComputeRes(res);
            })
        } else {
            // transfer the content image by the style image
            this.svc.transfer(this.originalImgSrc, this.customComponent.getSelectedStyle()).subscribe(res => {
                this.showComputeRes(res);
            }); 
        }
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