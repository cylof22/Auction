import { Component, Input } from '@angular/core';

import { Masonry } from 'ng-masonry-grid';

import { ProductService } from './../../product/service/product.service';
import { Product } from './../../product/product.model/product';
import { OrderService } from './../../order/service/order.service'
import { Order } from './../../order/order.model/order'

@Component({
  selector: 'user-products-page',
  styleUrls: [ './user.products.component.css'],
  templateUrl: './user.products.component.html'
})

export class UserProductsComponent {
  @Input("username") username: string;
  shownProducts: Product[];
  allProducts: Product[];
  mySellings: Order[];    // use this parameter to judge if one product is edited

  _masonry: Masonry;

  currentIndex: number = 0;
  stepCount: number = 60;
  isAddingIterms: boolean = false;

  constructor(private productService: ProductService,
              private orderService: OrderService) {
  }

  ngOnInit() {
    this.productService.getProductsByUser(this.username).subscribe(
        params => this.initProducts(params)
    );

    this.orderService.getMySellings(this.username).subscribe(
      orders => this.mySellings = orders
    )
  }

  isReadonly(productId: string) {
    if (this.mySellings == null) {
      return false;
    }

    for (let i = 0; i < this.mySellings.length; i++) {
      if (this.mySellings[i].id == productId) {
        return true;
      }
    }

    return false;
  }

  initProducts(inputs: Product[]) {
    this.allProducts = inputs;
    this.currentIndex = 0;

    this.shownProducts = this.allProducts.splice(this.currentIndex, this.stepCount);
    this.currentIndex = this.currentIndex + this.stepCount;
  }
  
  onNgMasonryInit($event: Masonry) {
    this._masonry = $event;
  }

  onScroll() {
    if (this.getScrollTop() + this.getCurrentAreaHeight() + 30 >= this.getScrollHeight()) {
      this.addItems();
    }
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
    this.shownProducts = this.shownProducts.concat(addedItems);
    this.currentIndex = newIndex;

    this.isAddingIterms = false;
  }

  getScrollTop() : number {
    let scrollTop = 0, areaScrollTop = 0, documentScrollTop = 0;
    let areaCtrl = document.getElementById('products');
    if (areaCtrl){
      areaScrollTop = areaCtrl.scrollTop;
    }
    if (document.documentElement){
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (areaScrollTop - documentScrollTop > 0) ? areaScrollTop : documentScrollTop;
    return scrollTop;
  }
     
  getScrollHeight() : number {
    let scrollHeight = 0, areaScrollHeight = 0, documentScrollHeight = 0;
    let areaCtrl = document.getElementById('products');
    if (document.body){
      areaScrollHeight = areaCtrl.scrollHeight;
    }
    if (document.documentElement){
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (areaScrollHeight - documentScrollHeight > 0) ? areaScrollHeight : documentScrollHeight;
    return scrollHeight;
  }
     
  getCurrentAreaHeight() : number{
    let areaCtrl = document.getElementById('products');
    return areaCtrl.offsetHeight;
  }
}

