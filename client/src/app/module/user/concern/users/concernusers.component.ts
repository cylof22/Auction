import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'

import { ProductService } from './../../../product/service/product.service';
import { UserService } from './../../service/user.service';
import { Product } from './../../../product/product.model/product';
import { UserInfo } from './../../user.model/user'

@Component({
  selector: 'user-concernedusers-page',
  styleUrls: [ './concernusers.component.css' ],
  templateUrl: './concernusers.component.html'
})

export class ConcernUsersComponent {
  concernedUsers: string[];

  constructor(private userService: UserService,
              router: ActivatedRoute) {

    const username = router.snapshot.params['username'];
    
    // get owned products

/*     this.concernedUsers.push("Test1");
    this.concernedUsers.push("Test2");
    this.concernedUsers.push("Test3"); */
  }
}

