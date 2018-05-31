import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'

import { MetaMaskService } from './../services/metamask.service'

@Component({
    selector: 'wallet-info-page',
    templateUrl: './wallet.info.component.html',
    styleUrls: ['./wallet.info.component.css']
})
export class WalletInfoComponent {
    metaMaskInstalled: boolean = false;
    metaMaskLocked: boolean = true;

    constructor(private metaMaskService: MetaMaskService) {
        this.metaMaskInstalled = metaMaskService.isMetaMaskInstalled();
    }

    ngOnInit() {
        Observable.fromEvent(window, 'load').subscribe((event) => {  
            this.onWindowsLoad();  
          }); 
    }

    onWindowsLoad() {
        // web3 check is wrapped in a window event('load') handler. This approach 
        // avoids race conditions with web3 injection timing
        if (this.metaMaskInstalled) {
            this.metaMaskLocked = this.metaMaskService.isMetaMaskLocked();
        }
    }

    isSupportedBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器 
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器 
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器 
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器 
        var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1 && !isEdge; //判断是否Safari浏览器 
        var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && !isEdge; //判断Chrome浏览器 
    }

    onClickItem(currentBtn: HTMLElement, expandCtrl: HTMLElement) {
        if (expandCtrl.innerHTML == '+') {
            expandCtrl.innerHTML = '-';
            currentBtn.style.color = 'cornflowerblue';
        } else if (expandCtrl.innerHTML == '-') {
            expandCtrl.innerHTML = '+';
            currentBtn.style.color = 'grey';
        }
    }

    onClickInstallInfo(installBtn: HTMLElement, expandCtrl: HTMLElement) {
        this.onClickItem(installBtn, expandCtrl);
    }

    onClickLockInfo(currentBtn: HTMLElement, expandCtrl: HTMLElement) {
        this.onClickItem(currentBtn, expandCtrl);
    }

    onClickObtainInfo(currentBtn: HTMLElement, expandCtrl: HTMLElement) {
        this.onClickItem(currentBtn, expandCtrl);
    }

    onClickTransferInfo(currentBtn: HTMLElement, expandCtrl: HTMLElement) {
        this.onClickItem(currentBtn, expandCtrl);
    }
}