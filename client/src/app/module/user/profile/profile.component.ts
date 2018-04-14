import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';

import { UserService } from '../service/user.service';
import { Product } from '../../product/product.model/product';
import { UserInfo } from '../user.model/user'

@Component({
  selector: 'user-profile-page',
  styleUrls: [ './profile.component.css' ],
  templateUrl: './profile.component.html'
})

export class UserProfileComponent {
  currentUserInfo: UserInfo;
  concernedProducts: Product[];
  concernedUsers: UserInfo[];
  errorMessage: string;

  constructor(private userService: UserService,
              router: ActivatedRoute) {

    const userId = router.snapshot.params['userId'];

    this.userService
        .getUserInfo(userId)
        .subscribe(
            userInfo => this.currentUserInfo = userInfo,
            error => console.error(error));
      
    this.userService
        .getConcernedProducts(userId)
        .subscribe(
            products => this.concernedProducts = products,
            error => console.error(error));

    this.userService
        .getConcernedUsers(userId)
        .subscribe(
            users => this.concernedUsers = users,
            error => console.error(error));
  }
}

