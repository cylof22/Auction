import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from './../service/user.service';

enum ShownElement {
    Products,       // all owned products
    Favorite,       // favorited products
    Concern,        // concerned users
    Order,          // orders for buyer
    Selling,        // orders for seller
    Wallet,
    Profile
}

@Component({
  selector: 'user-main-page',
  styleUrls: [ './user.main.component.css' ],
  templateUrl: './user.main.component.html'
})

export class UserMainComponent {
    username: string;
    shownElement: ShownElement;
    activeClassName: string;

  constructor(private router: ActivatedRoute,
              private userService: UserService) {
    this.shownElement = ShownElement.Products;
    this.activeClassName = "active";
    this.username = router.snapshot.params['username'];
  }

  clearActiveClass(currentCtrl: HTMLElement) {
    var elems = document.getElementsByClassName("button");
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem != currentCtrl) {
            if (elem.classList.contains(this.activeClassName)){
                elem.classList.remove(this.activeClassName);
            }
        }
    }
  }

  onClickProducts(currentCtrl: HTMLElement) {
    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);

    this.shownElement = ShownElement.Products;
  }

  onClickFavorite(currentCtrl: HTMLElement) {
    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);

    this.shownElement = ShownElement.Favorite;
  }

  onClickConcern(currentCtrl: HTMLElement) {
    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);

    this.shownElement = ShownElement.Concern;
  }

  onClickOrder(currentCtrl: HTMLElement) {
    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);

    this.shownElement = ShownElement.Order;
  }

  onClickSelling(currentCtrl: HTMLElement) {
    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);

    this.shownElement = ShownElement.Selling;
  }

  onClickWallet(currentCtrl: HTMLElement) {
    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);

    this.shownElement = ShownElement.Wallet;
  }

  onClickProfile(currentCtrl: HTMLElement) {
    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);

    this.shownElement = ShownElement.Profile;
  }
}

