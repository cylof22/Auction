import { EventEmitter, Component, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ProductService } from './../../product/service/product.service'
import { BatchProducts, UploadProduct, ProductStory, ProductPrice } from './../../product/product.model/product'
import { AuthenticationService } from './../../authentication/services/authentication.service'
import { StyleUploadService} from './../services/style.upload.service'

const redColor = "red";
const blueColor = "cornflowerblue";
const transparentColor = "transparent";

enum EPriceType {
    Fix,
    Auction,
    OnlyShow
};

enum EProdcutType {
    Digit,
    Entity
}

@Component({
    selector: 'style-input',
    templateUrl: './style.input.component.html',
    styleUrls: ['./style.input.component.css']
})

export class StyleInputComponent {
    @Input() hasStory: boolean = true;
    @Output() onUploadProductData: EventEmitter<any> = new EventEmitter;

    formModel: FormGroup;
    tags: string[];
    selectedTags: string[];
    priceType: EPriceType;
    productType: EProdcutType;

    startInputPrice: boolean = false;
    priceChanged: boolean = false;
    poundage: string;

    constructor(private productService: ProductService,
                private router: ActivatedRoute,
                private authService: AuthenticationService,
                private uploadService: StyleUploadService) {
        const fb = new FormBuilder();
        this.formModel = fb.group({
        'cusmizedTags': '',
        'userDescp': '',
        'price': '',
        'maker': ''
        })

        this.tags = productService.getAllTags();
        this.selectedTags = [];
        this.productType = EProdcutType.Digit;
        this.priceType = EPriceType.Fix;

        if  (router.snapshot.params['hasStory'] == 'false') {
            this.hasStory = false;
          }
    }

    ngOnInit() {
        let materialObj = document.getElementById("digInput");
        materialObj.style.backgroundColor = blueColor;

        let fixPrice = document.getElementById("fix");
        fixPrice.style.backgroundColor = blueColor;
    }

    selectFile() {
        var selectCtrl = document.getElementById("storyImagePath");
        selectCtrl.click();

        // alert if more than 4 images that selected
        let imageShowArea = document.getElementById("storyImages");
        if (imageShowArea.childElementCount == 3) {
            document.getElementById("selectBtn").setAttribute("disabled", "true")
        }
    }

    showImage(input) {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function(e) {
            let imageShowArea = document.getElementById("storyImages");
            let gridItem = document.createElement("div");
            gridItem.setAttribute("class", "thumbnail col-sm-3 col-lg-3 col-md-3");
            imageShowArea.appendChild(gridItem); 

            let img = document.createElement("img");
            img.src = this.result;
            gridItem.appendChild(img);
        }
    }

    onClickTag(ctrl: HTMLElement) {
        if (ctrl.style.backgroundColor == blueColor) {
            ctrl.style.backgroundColor = transparentColor;
            
            let tagValue = ctrl.innerText;
            let index = this.selectedTags.indexOf(tagValue);
            if (index != -1) {
                this.selectedTags.splice(index);
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

    onClickFix(ctrl: HTMLElement) {
        this.priceType = EPriceType.Fix;
        this.selectButton(ctrl, ["auction", "onlyShow"]);
    }

    onClickAuction(ctrl: HTMLElement) {
        this.priceType = EPriceType.Auction;
        this.selectButton(ctrl, ["fix", "onlyShow"]);
    }

    onClickOnlyShow(ctrl: HTMLElement) {
        this.priceType = EPriceType.OnlyShow;
        this.selectButton(ctrl, ["auction", "fix"]);
        this.poundage = "";
    }

    beginPrice(priceInput: HTMLElement) {
        this.startInputPrice = true;
    }

    endPrice(priceInput: HTMLElement) {
        if (!this.startInputPrice || !this.priceChanged) {
            return;
        }

        let temp = this.productService.getPoundage(this.formModel.value["price"]);
        this.poundage = temp.toString();

        this.startInputPrice = false;
        this.priceChanged = false;
    } 

    changePrice() {
        this.priceChanged = true;
    }

    getPriceInfo() : ProductPrice { 
        let productPrice = new ProductPrice(this.priceType.toString(), 
            this.formModel.value["price"]);

        return productPrice;
    }

    getTags(): string[] {
        // customized tags
        let tagsValue = this.formModel.value['cusmizedTags'];
        let tagArray = tagsValue.split(',');
        for (let i = 0; i < tagArray.length; i++) {
            this.selectedTags.push(tagArray[i].replace(/(^\s*)|(\s*$)/g, ""));
        }

        return this.selectedTags;
    }

    getUserStory(): ProductStory {
        let description = this.formModel.value["userDescp"];
        let pics = [];

        if (this.hasStory) {
            let pictureBox = document.getElementById("storyImages");
            let pictures = pictureBox.getElementsByTagName("img");
            for (let i = 0; i < pictures.length; i++) {
                pics.push(pictures[i].getAttribute("src"))
            }
        }

        return new ProductStory(description, pics);
    }

    onSubmit() {
        let tags = this.getTags();
        let story = this.getUserStory();
        let price = this.getPriceInfo();
        let productType = this.productType;
        let owner = this.authService.currentUser.username;
        let maker = this.formModel.value["maker"];
        if (maker == "") {
            maker = owner;
        }

        if (this.hasStory) {
            let uploadData = new UploadProduct('', '', tags, owner, maker, story, productType.toString(), price);
            this.onUploadProductData.emit(uploadData);
        } 
        else {
            let uploadData = new BatchProducts([''], tags, owner, maker, productType.toString(), price);
            this.onUploadProductData.emit(uploadData);
        }
    }

    onCancel() {

    }
}