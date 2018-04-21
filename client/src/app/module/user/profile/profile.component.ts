import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'

import { ProductService } from './../../product/service/product.service';
import { UserService } from '../service/user.service';
import { Product, ProductStatus } from '../../product/product.model/product';
import { UserInfo } from '../user.model/user'

@Component({
  selector: 'user-profile-page',
  styleUrls: [ './profile.component.css' ],
  templateUrl: './profile.component.html'
})

export class UserProfileComponent {
  username: string;
  currentUserInfo: UserInfo;

  constructor(private userService: UserService,
              router: ActivatedRoute) {

    this.username = router.snapshot.params['username'];
    //alert(username)

/*     this.userService
        .getUserInfo(username)
        .subscribe(
            userInfo => this.currentUserInfo = userInfo,
            error => console.error(error)); */
  }
}

