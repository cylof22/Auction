import { EventEmitter, Component, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

import { ProductService } from './../../product/service/product.service'
import { BatchProducts, UploadProduct, ProductStory, ProductPrice, Product, EPriceType, EProdcutType } from './../../product/product.model/product'
import { AuthenticationService } from './../../authentication/services/authentication.service'

const redColor = "red";
const blueColor = "cornflowerblue";
const transparentColor = "transparent";

@Component({
    selector: 'product-input',
    templateUrl: './product.input.component.html',
    styleUrls: ['./product.input.component.css']
})

export class ProductInputComponent {
    @Input('isBatch') isBatch: boolean = true;
    @Input('product') editProduct: Product;
    @Output() onUploadProductData: EventEmitter<any> = new EventEmitter;

    tags: string[];             // default tags for showing

    selectedTags: string[];     // seleted tags from upper tags
    priceType: EPriceType;
    productType: EProdcutType;

    // for edit
    initializedPriceValue: string = '';

    constructor(private productService: ProductService,
                private router: ActivatedRoute,
                private authService: AuthenticationService) {

        this.tags = productService.getAllTags();
        this.selectedTags = [];
        this.productType = EProdcutType.Digit;
        this.priceType = EPriceType.OnlyShow;

        if (router.snapshot.params['isBatch'] == 'false') {
            this.isBatch = false;
        }

    }

    ngOnInit() {
        if (this.editProduct != undefined) {
            this.initPageForEdit(this.editProduct);
        } else {
            this.hightlightCtrl("digInput");
        }

        if (this.isBatch) {
            let storyCtrl = document.getElementById("storyArea");
            storyCtrl.hidden = true;
        }
    }

    initPageForEdit(product:Product) {
        this.initTagsForEdit(product.tags);

        this.initUserStory(product.story);

        this.initPicType(product.type);

        this.initMaker(product.maker);
    }

    initTagsForEdit(currentTags: string[]) {
        if (currentTags == null) {
            return;
        }

        let customizedTags = '';
        for (let i = 0; i < currentTags.length; i++) {
            let currentTag = currentTags[i];
            if (currentTag == '') {
                continue;
            }

            if (this.tags.includes(currentTag)) {
                this.selectedTags.push(currentTag);
            } else {
                if (customizedTags.length == 0) {
                    customizedTags = customizedTags + currentTag;
                } else {
                    customizedTags = customizedTags + ',' + currentTag;
                }
            }
        }

        let tagInputCtrl = <HTMLInputElement>document.getElementById('taginput');
        tagInputCtrl.value = customizedTags;
    }

    initTagColor(tagValue: string) {
        if (this.editProduct == undefined) {
            return transparentColor;
        }

        if (this.selectedTags.includes(tagValue)) {
            return blueColor;
        }

        return transparentColor;
    }

    initUserStory(story: ProductStory) {
        if (story.description != '') {
            let despCtrl = <HTMLTextAreaElement>document.getElementById('description');
            despCtrl.value = story.description;
        }

        if (story.pictures != null) {
            for (let i = 0; i < story.pictures.length; i++) {
                this.addStoryImage(story.pictures[i]);
            }

            this.forbidStoryImageSelect();
        }
    }

    initPicType(productType: string) {
        let type = parseInt(productType);
        switch(type) {
            case EProdcutType.Digit:
            this.hightlightCtrl('digInput');
            break;
            case EProdcutType.Entity:
            this.hightlightCtrl('matInput');
            break;
        }
    }

    initMaker(maker: string) {
        let makerCtrl = <HTMLInputElement>document.getElementById('maker');
        makerCtrl.value = maker;
    }

    hightlightCtrl(id: string) {
        let materialObj = document.getElementById(id);
        materialObj.style.backgroundColor = blueColor;
    }

    selectFile() {
        var selectCtrl = document.getElementById("storyImagePath");
        selectCtrl.click();
    }

    showImage(input) {
        let imgCtrl = this.addStoryImage('');

        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function(e) {
            imgCtrl.src = this.result;
        }

        reader.onloadend = () => {
            this.forbidStoryImageSelect();
        }
    }

    forbidStoryImageSelect() {
        let imageShowArea = document.getElementById("storyImages");
        if (imageShowArea.childElementCount == 4) {
            document.getElementById("selectBtn").setAttribute("disabled", "true")
        }
    }

    addStoryImage(imageSrc: string): HTMLImageElement {
        let imageShowArea = document.getElementById("storyImages");
        let gridItem = document.createElement("div");
        gridItem.setAttribute("class", "thumbnail col-sm-3 col-lg-3 col-md-3");
        imageShowArea.appendChild(gridItem); 

        let img = document.createElement("img");
        img.src = imageSrc;
        gridItem.appendChild(img);

        return img;
    }

    onClickTag(ctrl: HTMLElement) {
        if (ctrl.style.backgroundColor == blueColor) {
            ctrl.style.backgroundColor = transparentColor;
            
            let tagValue = ctrl.innerText;
            let index = this.selectedTags.indexOf(tagValue);
            if (index != -1) {
                this.selectedTags.splice(index, 1);
            }
        } else {
            ctrl.style.backgroundColor = blueColor;

            this.selectedTags.push(ctrl.innerText);
        }
    }

    selectButton(selButton: HTMLElement, others: string[]) {
        if (selButton.style.backgroundColor == blueColor) {
            return;
        } else {
            selButton.style.backgroundColor = blueColor;
        }

        // unselect the other controls
        for (var i = 0; i < others.length; i++) {
            let materialObj = document.getElementById(others[i]);
            if (materialObj.style.backgroundColor == blueColor) {
                materialObj.style.backgroundColor = transparentColor;
            }
        }
    }

    onClickDigtal(ctrl: HTMLElement) {
        this.productType = EProdcutType.Digit;
        this.selectButton(ctrl, ["matInput"]);
    }

    onClickMaterial(ctrl: HTMLElement) {
        this.productType = EProdcutType.Entity;
        this.selectButton(ctrl, ["digInput"]);
    }

    getTags(): string[] {
        // customized tags
        let tagCtrl = <HTMLInputElement>document.getElementById('taginput');
        let tagsValue = tagCtrl.value;
        let tagArray = tagsValue.split(',');
        for (let i = 0; i < tagArray.length; i++) {
            this.selectedTags.push(tagArray[i].replace(/(^\s*)|(\s*$)/g, ""));
        }

        return this.selectedTags;
    }

    getUserStory(): ProductStory {
        let descripCtrl = <HTMLTextAreaElement>document.getElementById('description');
        let description = descripCtrl.value;

        let pics = [];
        let pictureBox = document.getElementById("storyImages");
        let pictures = pictureBox.getElementsByTagName("img");
        for (let i = 0; i < pictures.length; i++) {
            pics.push(pictures[i].getAttribute("src"))
        }

        return new ProductStory(description, pics);
    }

    onSubmit() {
        let tags = this.getTags();
        let story = this.getUserStory();
        let price = new ProductPrice('', '', '');
        let productType = this.productType;
        let owner = this.authService.currentUser.username;

        let makerCtrl = <HTMLInputElement>document.getElementById('maker');
        let maker = makerCtrl.value;
        if (maker == "") {
            maker = owner;
        }

        if (!this.isBatch) {
            let uploadData = new UploadProduct('', '', tags, owner, maker, story, productType.toString(), price);
            this.onUploadProductData.emit(uploadData);
        } 
        else {
            let uploadData = new BatchProducts([], tags, owner, maker, productType.toString(), price);
            this.onUploadProductData.emit(uploadData);
        }
    }

    onCancel() {

    }
}