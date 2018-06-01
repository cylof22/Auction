import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'

import { Order } from './../order.model/order'
import { OrderService } from './../service/order.service'

import { ProductService } from './../../product/service/product.service';
import { Product } from './../../product/product.model/product';

import { NgModule } from '@angular/core';
import { Masonry } from 'ng-masonry-grid';

@Component({
  selector: 'shop-page',
  styleUrls: [ './shop.component.css' ],
  templateUrl: './shop.component.html'
})

export class ShopComponent {
  orders: Order[];
  allOrders: Order[];

  _masonry: Masonry;

  currentIndex: number = 0;
  stepCount: number = 8;
  isAddingIterms: boolean = false;

  constructor(private productService: ProductService,
              private orderService: OrderService) {
    this.orderService.getOrdersInTransaction().subscribe(
      results => this.initOrders(results)
    )
  }

  ngOnInit() {
  }

  initOrders(inputs: Order[]) {
    this.allOrders = inputs;
    this.currentIndex = 0;

    this.orders = this.allOrders.slice(this.currentIndex, this.stepCount);
    this.currentIndex = this.currentIndex + this.stepCount;
  }

  getScrollTop() : number {
    let scrollTop = 0, areaScrollTop = 0, documentScrollTop = 0;
    let areaCtrl = document.getElementById('orders');
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
    let areaCtrl = document.getElementById('orders');
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
    let areaCtrl = document.getElementById('orders');
    return areaCtrl.offsetHeight;
  }

  onScroll() {
    if (this.getScrollTop() + this.getCurrentAreaHeight() + 30 >= this.getScrollHeight()) {
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

    let totalCount = this.allOrders.length;
    if (this.currentIndex >= totalCount) {
      return;
    }

    this.isAddingIterms = true;
    this._masonry.setAddStatus('append');
    let newIndex = this.currentIndex + this.stepCount;
    if (newIndex > totalCount) {
      newIndex = totalCount;
    }

    let addedItems = this.allOrders.slice(this.currentIndex, newIndex);
    this.orders = this.orders.concat(addedItems);
    this.currentIndex = newIndex;

    this.isAddingIterms = false;
  }
}

