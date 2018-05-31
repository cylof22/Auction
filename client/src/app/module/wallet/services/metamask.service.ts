import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable'

const Web3 = require('web3');
declare var window: any;

@Injectable()
export class MetaMaskService {
    constructor() {
    }

    isMetaMaskInstalled(): boolean {
        if (typeof window.web3 !== 'undefined') {
            if (window.web3.currentProvider.isMetaMask) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    isMetaMaskLocked(): boolean {
        if (typeof window.web3 !== 'undefined') {
            if (window.web3.currentProvider.isMetaMask) {
                if (window.web3.eth.accounts.length == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return true;
    }
}