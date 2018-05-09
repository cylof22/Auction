import { Component, Input } from '@angular/core';

import { UserService } from '../service/user.service';
import { UserInfo } from '../user.model/user'

import { ProductService } from './../../product/service/product.service'

@Component({
  selector: 'user-profile-page',
  styleUrls: [ './user.profile.component.css' ],
  templateUrl: './user.profile.component.html'
})

export class UserProfileComponent {
  @Input() username: string;
  currentUserInfo: UserInfo;
  tags: string[];
  hasPortrait: boolean;

  constructor(private userService: UserService,
              private productService: ProductService) {
    this.tags = this.productService.getAllTags();
  }

  ngOnInit() {
    // this.userService.getUserInfo(this.username).subscribe(
    //   result => this.currentUserInfo = result
    // )

    //this.test();

    if (this.currentUserInfo != undefined) {
      this.hasPortrait = (this.currentUserInfo.headPortraitUrl != '');
    }
  }

  test() {
    this.currentUserInfo = new UserInfo(this.username, '', '', 'test@test.com');
  }

  selectPortrait() {
    var selectCtrl = document.getElementById("portraitFile");
    selectCtrl.click();
  }

  showPortrait(portrait) {
      // show image
      let reader = new FileReader();
      let file = portrait.files[0];
      reader.readAsDataURL(file);
      reader.onload = function(e) {
          let img = document.getElementById("portraitImg");
          img.setAttribute("src", this.result);
      }

      this.hasPortrait = true;
  }

  onClickTag(ctrl: HTMLElement) {
    if (ctrl.style.backgroundColor == 'cornflowerblue') {
        ctrl.style.backgroundColor = 'transparent';
    } else {
        ctrl.style.backgroundColor = 'cornflowerblue';
    }
}
}

