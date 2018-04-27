import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from './../../product/service/product.service'
import { StyleUploadService } from './../services/style.upload.service'

@Component({
    selector: 'style-batch-upload',
    templateUrl: './style.batch.component.html',
    styleUrls: ['./style.batch.component.css']
})

export class StyleBatchComponent {

    constructor(private productService: ProductService,
                private uploadService: StyleUploadService,
                router: ActivatedRoute) {
    }

    selectFolder() {
        var selectCtrl = document.getElementById("folderCtrl");
        selectCtrl.click();
    }

    onFolderSelected(files) {
        // clear old data
        let gridGroup = document.getElementById("gridGroup");
        if (gridGroup.childElementCount > 0) {
            gridGroup.innerHTML = "";
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const path = file.webkitRelativePath.split('/');

            switch (file.type) {
                case 'image/png':
                case 'image/jpg':
                case 'image/jpeg':
                this.readPic(file, i, gridGroup);
                break;
            }
        }
    }

    readPic(file, index, parentElem) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            let gridItem = document.createElement("div");
            gridItem.setAttribute("class", "thumbnail imageBox col-sm-4 col-lg-4 col-md-4");
            parentElem.appendChild(gridItem); 

            let img = document.createElement("img");
            img.setAttribute("class", "style-image");
            img.src = this.result;
            gridItem.appendChild(img);
        }
    }

    onUploadProducts(data) {
        let uploadProducts = data;

        // get pictures' data
        let imgGroup = document.getElementById("gridGroup");
        let pictures = imgGroup.getElementsByTagName("img");
        for (let i = 0; i < pictures.length; i++) {
            uploadProducts.datas.push(pictures[i].getAttribute("src"))
        }
        this.uploadService.batchUpload(uploadProducts).subscribe( output => {
            location.href = "/#/";
        });
    }
}