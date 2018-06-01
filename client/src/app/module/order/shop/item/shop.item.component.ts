import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Order } from './../../order.model/order'

@Component({
  selector: 'shop-item',
  styleUrls: [ './shop.item.component.css' ],
  templateUrl: './shop.item.component.html'
})

export class ShopItemComponent {
  @Input() order: Order;
  canShowCtrls: boolean = false;

  constructor(private route:Router) {
  }

  ngOnInit() {
  }

  showProduct() {
    this.route.navigate(["/products/" + this.order.product.id]);
  }

  showCtrls(imageCtrl: HTMLElement) {
    this.canShowCtrls = true;
  }

  removeCtrls(imageCtrl: HTMLElement) {
    this.canShowCtrls = false;
  }
}

