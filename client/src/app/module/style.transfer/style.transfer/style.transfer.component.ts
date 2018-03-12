import { Component } from '@angular/core';
import { StyleTransferService } from '../services/style.service';

@Component({
    selector: 'style-transfer',
    templateUrl: './style.transfer.component.html',
})
export class StyleTransferComponent {
    contentFile : string;
    styleFile : string;
    outputFile : string;

    constructor(private svc : StyleTransferService) {
        
    }

    OnContentChange($file) {
        
    }
}