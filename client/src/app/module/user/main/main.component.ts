import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'

/* import { ProductService } from './../../product/service/product.service';
import { UserService } from '../service/user.service';
import { Product, ProductStatus } from '../../product/product.model/product';
import { UserInfo } from '../user.model/user' */

enum ShownElem {
    Shopping,
    Profile,
    ConcernedUsers,
}

@Component({
  selector: 'user-main-page',
  styleUrls: [ './main.component.css' ],
  templateUrl: './main.component.html'
})

export class UserMainComponent {
    username: string;
    showShop: boolean;
    showProfile: boolean;
    showConUsers: boolean;
    shownElem: ShownElem;
    activeClassName: string;

  constructor(router: ActivatedRoute) {
    this.shownElem = ShownElem.Shopping;
    this.activeClassName = "active";
    this.username = router.snapshot.params['username'];
    
    // get owned products
/*     let searchParas = {
        "owner":username,
    } 
    this.productService.search(searchParas).subscribe(
        params => {
            this.productsInShop = params;
        }
    ); */
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

  onClickShop(currentCtrl: HTMLElement) {
    this.shownElem = ShownElem.Shopping;

    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);
  }

  onClickProfile(currentCtrl: HTMLElement) {
    this.shownElem = ShownElem.Profile;

    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);
  }

  onClickConUsers(currentCtrl: HTMLElement) {
    this.shownElem = ShownElem.ConcernedUsers; 

    this.clearActiveClass(currentCtrl);
    currentCtrl.classList.add(this.activeClassName);
  }
}

