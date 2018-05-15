import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'

import { ProductService } from './../../../product/service/product.service';
import { UserService } from './../../service/user.service';
import { Product } from './../../../product/product.model/product';
import { ConcernedUser } from './../../user.model/user'

@Component({
  selector: 'user-concernusers-page',
  styleUrls: [ './user.concernusers.component.css' ],
  templateUrl: './user.concernusers.component.html'
})

export class ConcernUsersComponent {
  @Input("username") username: string;
  concernedUsers: ConcernedUser[];

  constructor(private userService: UserService,
              private productService: ProductService) {
  }

  ngOnInit() {
/*     this.userService.getConcernedUsers(this.username).subscribe(
      res => this.concernedUsers = res
    ) */

    //this.test();
  }

  test() {
    this.productService.getProductsByUser(this.username).subscribe(
      res => {
        this.concernedUsers = new Array<ConcernedUser>();
        for (let i = 0; i < 5; i++) {
          let test = new ConcernedUser(this.username, '', '3', '4', []);
          for (let j = 0; j < 4; j++) {
            test.shownProducts.push(res[j].url);
          }

          this.concernedUsers.push(test);
        }
      }
    )
  }
}

