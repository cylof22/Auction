import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { EPriceType, ProductPrice } from './../../../product.model/product';
import { ProductService } from './../../../../product/service/product.service'
import { MetaMaskService } from './../../../../wallet/services/metamask.service'

const blueColor = "cornflowerblue";
const transparentColor = "transparent";

@Component({
  selector: 'product-sale-price-page',
  styleUrls: [ './product-sale.price.component.css' ],
  templateUrl: './product-sale.price.component.html'
})
export class ProductSalePriceComponent{
    @Input() defaultSaleCheckStatus: string;
    @Input() showSellButton: string;
    @Output() onSaleSwitchEvent: EventEmitter<any> = new EventEmitter;
    @Output() onSellEvent: EventEmitter<any> = new EventEmitter;

    formModel: FormGroup;
    priceType: string = '0'; 

    poundage: string = '';           // poundage value according to current price

    showWalletDlg: boolean = false;

    constructor(private productService: ProductService,
                private metaMaskService: MetaMaskService) {
        const fb = new FormBuilder();
        this.formModel = fb.group({
        'priceValue': '',
        'duration': '',
        })
    }

    ngOnInit() {
        let saleCheckCtrl = <HTMLInputElement>document.getElementById('saleCheck');
        if (this.defaultSaleCheckStatus == 'true') {
            saleCheckCtrl.checked = true;
        } else {
            saleCheckCtrl.checked = false;
        }
    }

    onSwitchSaleCheck() {
        let saleCheckCtrl = <HTMLInputElement>document.getElementById('saleCheck');
        this.onSaleSwitchEvent.emit(saleCheckCtrl.checked);

        if (saleCheckCtrl.checked) {
            if (this.metaMaskService.isMetaMaskLocked()) {
                saleCheckCtrl.checked = false;
                location.href = '/#/wallet-info';
            }
        }
    }

    getPlaceHolder() {
        let ePpriceType = parseInt(this.priceType);
        if (ePpriceType == EPriceType.Fix) {
            return "please input price";
        } else if (ePpriceType == EPriceType.Auction) {
            return "please input starting price"
        }
    }

    getFixColor(): string {
        let ePpriceType = parseInt(this.priceType);
        if (ePpriceType == EPriceType.Fix) {
            return blueColor;
        } else {
            return transparentColor;
        }
    }

    getAuctionColor() {
        let ePpriceType = parseInt(this.priceType);
        if (ePpriceType == EPriceType.Auction) {
            return blueColor;
        } else {
            return transparentColor;
        }
    }

    onClickFix(ctrl: HTMLElement) {
        this.priceType = EPriceType.Fix.toString();
    }

    onClickAuction(ctrl: HTMLElement) {
        this.priceType = EPriceType.Auction.toString();
    }

    calPoundage() {
        let priceValue = <HTMLInputElement>document.getElementById('priceValue');
        if (priceValue.value == '') {
            return;
        }

        let temp = this.productService.getPoundage(priceValue.value);
        this.poundage = temp.toString() + 'ETH';
    }

    getPriceInfo() : ProductPrice { 
        let priceInfo = this.formModel.value;
        let productPrice = new ProductPrice(this.priceType.toString(), 
                                            priceInfo.priceValue.toString(),
                                            priceInfo.duration.toString());

        return productPrice;
    }

    submit() {
        if (this.metaMaskService.isMetaMaskLocked()) {
            location.href = '/#/wallet-info';
            return;
        }

        if (parseInt(this.priceType) == EPriceType.OnlyShow) {
            return;
        }

        let price = this.getPriceInfo();
        if (parseInt(price.duration) > 30) {
            return;
        }

        this.onSellEvent.emit(price);
    }
}
