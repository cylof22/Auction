import { Component } from '@angular/core';
import { ProductService } from '../../product/service/product.service'

@Component({
    selector: 'style-upload',
    templateUrl: './style.upload.component.html',
    styleUrls: ['./style.upload.component.css']
})

export class StyleUploadComponent {

    uploadFile: string;
    categories: string[];

    constructor(private productService: ProductService) {
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
    }
}