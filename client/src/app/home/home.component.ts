import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';

import { ProductService } from '../module/product/service/product.service';
import { Product } from '../module/product/product.model/product';

import { Masonry } from 'ng-masonry-grid';

@Component({
  selector: 'auction-home-page',
  styleUrls: [ './home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  products: Product[];
  allProducts: Product[];
  errorMessage: string;

  _masonry: Masonry;

  currentIndex: number = 0;
  stepCount: number = 20;
  isAddingIterms: boolean = false;

  constructor(private productService: ProductService) {
    let inputProducts = this.productService.getProducts()
      .retryWhen(errors => {
        alert("try again");
        this.errorMessage = `Please start the server. Retrying to connect.`;
        return errors
          .delay(10000) // Retry every 2 seconds
          //.take(3)   // Max number of retries
          .do(() => this.errorMessage += '.'); // Update the UI
      })
      .finally(() => this.errorMessage = null);

    inputProducts.subscribe(
      results => this.initProducts(results)
    )

    this.productService.searchEvent
      .subscribe(
        params => {
          this.products = [];
          this.productService.search(params).subscribe(
            results => {
              this.initProducts(results);
              this._masonry.reloadItems();
            }
          )
        },
        error => console.error(error),
        () => console.log('DONE')
      );
  }

  ngOnInit() {
    Observable.fromEvent(window, 'scroll').subscribe((event) => {  
      this.onWindowsScroll();  
    });  
  }

  initProducts(inputs: Product[]) {
    this.allProducts = inputs;
    this.currentIndex = 0;

    this.products = this.allProducts.splice(this.currentIndex, this.stepCount);
    this.currentIndex = this.currentIndex + this.stepCount;
  }

  OnClickHotest(event) {
    let target = event.target;
    this.colorTag(target.text);
    this.products = [];
    this.productService.getProductsByHotest().subscribe(
      results => {
        this.initProducts(results);
        this._masonry.reloadItems();
      }
    )
  }

  OnClickTag(event) {
    let target = event.target;
    this.colorTag(target.text);
    this.products = [];
    this.productService.getProductsByTag(target.text).subscribe(
      results => {
        this.initProducts(results);
        this._masonry.reloadItems();
      }
    )
  }

  colorTag(selectedTag: string) {
    let tagBar = document.getElementById("tag-nav") as HTMLUListElement;
    
    var tagTypes = tagBar.getElementsByTagName("li");
    for (let i = 0; i < tagTypes.length; i++) {
      var tagElem = tagTypes.item(i);
      var anchorElem = tagElem.getElementsByTagName("a")[0];
      if(tagElem.textContent == selectedTag) {
        anchorElem.style.color = '#0000EE';
      } else {
        // unselected black color
        anchorElem.style.color = '#000000';
      }
    }
  }

  getScrollTop() : number {
    let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if (document.body){
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement){
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  }
     
  getScrollHeight() : number {
    let scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body){
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement){
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  }
     
  getWindowHeight() : number{
    let windowHeight = 0;
    if (document.compatMode == "CSS1Compat"){
      windowHeight = document.documentElement.clientHeight;
    } else {
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  }


  onWindowsScroll() {
    if (this.getScrollTop() + this.getWindowHeight() + 30 >= this.getScrollHeight()) {
      this.addItems();
    }
  }

  onNgMasonryInit($event: Masonry) {
    this._masonry = $event;
  }

  addItems() {
    if (this.isAddingIterms) {
      return;
    }

    let totalCount = this.allProducts.length;
    if (this.currentIndex >= totalCount) {
      return;
    }

    this.isAddingIterms = true;
    this._masonry.setAddStatus('append');
    let newIndex = this.currentIndex + this.stepCount;
    if (newIndex > totalCount) {
      newIndex = totalCount;
    }

    let addedItems = this.allProducts.slice(this.currentIndex, newIndex);
    this.products = this.products.concat(addedItems);
    this.currentIndex = newIndex;

    this.isAddingIterms = false;
  }

}

