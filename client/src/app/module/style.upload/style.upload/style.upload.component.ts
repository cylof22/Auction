import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../product/service/product.service'
import { StyleUploadService } from '../services/style.upload.service'
import { Product } from '../../product/product.model/product'
import { Review } from '../../product/product.model/review'
import { Observable } from 'rxjs/Observable'

@Component({
    selector: 'style-upload',
    templateUrl: './style.upload.component.html',
    styleUrls: ['./style.upload.component.css']
})

export class StyleUploadComponent {
    formModel: FormGroup;
    categories: string[];
    uploadedData: Product;
    test: Product;

    constructor(private productService: ProductService,
                private uploadService: StyleUploadService) {
        const fb = new FormBuilder();
        this.formModel = fb.group({
        'owner': '',
        'description': '',
        'categories': ['']
        })
    }

    ngOnInit() {
        this.categories = this.productService.getAllCategories();
    }

    selectFile() {
        var selectCtrl = document.getElementById("imagePath");
        selectCtrl.click();
    }

    showImage(input) {
        // update image path
        let imgPathText = document.getElementById("pathText");
        imgPathText.innerText = input.value;

        // show image
        let reader = new FileReader();
        let file = input.files[0];
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            let img = document.getElementById("imagePreview");
            img.setAttribute("src", this.result);
        }
    }

    submit() {
        this.uploadedData = this.formModel.value;

        // get image data
        let img = document.getElementById("imagePreview");
        this.uploadedData.url = img.getAttribute("src");
        
        this.uploadService.uploadData(this.uploadedData).subscribe(
            product => this.test = product,
            error => console.error(error));
    }
}