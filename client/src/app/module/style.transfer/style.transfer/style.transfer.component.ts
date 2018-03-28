import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { StyleTransferService } from '../services/style.service';
import { Product } from '../../product/product.model/product'
import { ProductService } from '../../product/service/product.service'

@Component({
    selector: 'style-transfer',
    templateUrl: './style.transfer.component.html',
})
export class StyleTransferComponent {
    contentFile : string;
    styleFile : string;
    outputFile : string;
    products: Product[];

    constructor(private svc : StyleTransferService,
        private productService: ProductService) {
            this.productService.getProducts().subscribe(
                paras => this.products = paras,
            );
    }

    OnContentChange(event) {
        this.contentFile = event.target.files[0];
        this.handleFiles(event.target.files, "content-preview");
    }

    OnStyleChange(event) {
        this.contentFile = event.target.files[0];
        this.handleFiles(event.target.files, "style-preview");
    }

    handleFiles(files, previewID) {
        var preview = document.getElementById(previewID);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            
            if (!file.type.startsWith('image/')){ continue }
            
            var img = document.createElement("img");
            img.className = "img-responsive";
            preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
            
            var reader = new FileReader();
            reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
            reader.readAsDataURL(file);
        }
    }

    Transfer(event) {
        // Upload the content file
        var uploadedContentFile : string;
        this.svc.uploadContent(this.contentFile, this.contentFile).subscribe(res => {
            uploadedContentFile = res;

            // Upload the style file
            var uploadStyleFile : string;
            this.svc.uploadStyle(this.styleFile, this.styleFile).subscribe(res => {
                uploadStyleFile = res;

                // transfer the content image by the style image
                this.svc.transfer(uploadedContentFile, uploadStyleFile).subscribe(output => {
                    this.outputFile = output;
                });
            });
        });
    }

    updateSelecedImage(url: string) {
        let img = document.getElementById("selectedStyle");
        img.setAttribute("src", url);
    }
}