import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../product/service/product.service'
import { StyleUploadService } from '../services/style.upload.service'
import { Product } from '../../product/product.model/product'
import { Review } from '../../product/product.model/review'
import { Observable } from 'rxjs/Observable'
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'style-upload',
    templateUrl: './style.upload.component.html',
    styleUrls: ['./style.upload.component.css']
})

export class StyleUploadComponent {
    formModel: FormGroup;
    categories: string[];
    uploadedImgUrl: string;
    uploadedStyleUrl: string;
    uploadedData: Product;

    constructor(private productService: ProductService,
                private uploadService: StyleUploadService,
                router: ActivatedRoute) {
        const fb = new FormBuilder();
        this.formModel = fb.group({
        'owner': '图链',
        'price': '',
        'description': '',
        'categories': ['']
        })

        if (router.snapshot.params.hasOwnProperty("url") &&
            router.snapshot.params.hasOwnProperty("basedUrl")) {

            this.uploadedImgUrl = router.snapshot.params['url'];
            this.uploadedStyleUrl = router.snapshot.params['basedUrl'];
        }
    }

    ngOnInit() {
        this.categories = this.productService.getAllCategories();
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
        // update image path
        let imgPathText = document.getElementById("pathText");
        imgPathText.innerText = "选择其它文件";

        // show image
        let reader = new FileReader();
        let file = input.files[0];
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            let img = document.getElementById("imagePreview");
            img.style.height = "100%";
            img.setAttribute("src", this.result);
        }
    }

    submit() {
        this.uploadedData = this.formModel.value;
        if (this.uploadedStyleUrl != undefined && this.uploadedStyleUrl != "") {
            this.uploadedData.styleImgUrl = this.uploadedStyleUrl;
        }

        // get image data
        let img = document.getElementById("imagePreview");
        this.uploadedData.url = img.getAttribute("src");
        
        this.uploadService.uploadData(this.uploadedData).subscribe(
            error => console.error(error));

        // switch to main page
        location.href = "/#/";
    }
}