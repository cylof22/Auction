import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductService } from '../service/product.service'

@Component({
  selector: 'foot-scrollbar',
  templateUrl: './scrollBar.component.html',
  styleUrls: ['./scrollBar.component.css']
})

export class FootScrollBarComponent {
  scrollData: string;

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    //let dataArray = this.productService.getAllCategories();
    this.scrollData = "this is only test";

    let sText = document.querySelector('.scroll-text');
    sText.textContent = this.scrollData;
  }

}