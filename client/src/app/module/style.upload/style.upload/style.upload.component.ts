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
            let img = document.getElementById("imagePreview");
            img.style.height = "100%";
            img.setAttribute("src", this.uploadedImgUrl);
        }
    }

    selectFile() {
        var selectCtrl = document.getElementById("imagePath");
        selectCtrl.click();
    }

    showImage(input) {
        // show image
        let reader = new FileReader();
        let file = input.files[0];
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            let img = document.getElementById("imagePreview");
            //img.style.height = "100%";
            img.setAttribute("src", this.result);
        }
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
            location.href = "/#/";
        });
    }
}