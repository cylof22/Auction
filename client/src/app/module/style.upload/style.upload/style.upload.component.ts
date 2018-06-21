import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../product/service/product.service'
import { StyleUploadService } from './../services/style.upload.service'
import { UploadProduct } from '../../product/product.model/product'

@Component({
    selector: 'style-upload',
    templateUrl: './style.upload.component.html',
    styleUrls: ['./style.upload.component.css']
})

export class StyleUploadComponent {
    uploadedImgUrl: string;
    uploadedStyleUrl: string;

    showTransferDlg: boolean = false;
    showReselectCtrl: boolean = false;

    errorInfo: string = '';

    imgBlob : File = null;
    constructor(private productService: ProductService,
                private uploadService: StyleUploadService,
                router: ActivatedRoute) {


        if (router.snapshot.params.hasOwnProperty("url") &&
            router.snapshot.params.hasOwnProperty("basedUrl")) {

            this.uploadedImgUrl = router.snapshot.params['url'];
            this.uploadedStyleUrl = router.snapshot.params['basedUrl'];
        }
    }

    ngOnInit() {
        if (this.uploadedImgUrl != undefined && this.uploadedImgUrl != "") {
            // hide select controls
            var selectGroup = document.getElementById("fileSelGroup")
            selectGroup.style.visibility = "hidden";

            // show image
            this.showUploadedImage(this.uploadedImgUrl);
        }
    }

    selectFile() {
        if (this.errorInfo != '') {
            this.errorInfo = '';
        }
        
        var selectCtrl = document.getElementById("imagePath");
        selectCtrl.click();
    }

    showImage(input) {
        // show image
        let reader = new FileReader();
        let file = input.files[0];
        this.imgBlob = file;
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            let img = document.getElementById("imagePreview");
            img.setAttribute("src", this.result);
        }
    }

    showUploadedImage(imageSrc) {
        let img = document.getElementById("imagePreview");
        img.setAttribute("src", imageSrc);
    }

    onUploadProduct(data) {
        let uploadProduct = data;
        if (this.uploadedStyleUrl != undefined && this.uploadedStyleUrl != "") {
            uploadProduct.styleData = this.uploadedStyleUrl;
        }

        // get image data
        let img = document.getElementById("imagePreview");
        uploadProduct.picData = img.getAttribute("src");
        this.uploadService.uploadData(uploadProduct).subscribe( output => {
            if (output.hasOwnProperty('error')) {
                this.errorInfo = output['error'];
            } else {
                location.href = "/#/";
            }
        });
    }

    doTransfer() {
        this.showTransferDlg = true;
    }

    onCompleteTransfer(data) {
        this.showTransferDlg = false;

        if (data.hasOwnProperty('url') &&
            data.hasOwnProperty('basedUrl')) {
            this.uploadedImgUrl = data['url'];
            this.uploadedStyleUrl = data['basedUrl'];

            // show image
            this.showUploadedImage(this.uploadedImgUrl);
        }
    }

    showReselectBtn() {
        let img = document.getElementById("imagePreview");
        if (img == null) {
            this.showReselectCtrl = false;
            return;
        }
        
        let srcValue = img.getAttribute("src");
        if (srcValue == null) {
            this.showReselectCtrl = false;
            return;
        }

        if (srcValue != '') {
            this.showReselectCtrl = true;
        } else {
            this.showReselectCtrl = false;
        }
    }

    removeReselectBtn() {
        this.showReselectCtrl = false;
    }
}