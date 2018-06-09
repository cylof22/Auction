import { Component, Input } from '@angular/core';

import { UserService } from '../service/user.service';
import { UserInfo, UpdateInfo } from '../user.model/user'

import { ProductService } from './../../product/service/product.service'
import { AuthenticationService } from './../../authentication/services/authentication.service'

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

  errorInfo: string = '';

  constructor(private userService: UserService,
              private productService: ProductService,
              private authService: AuthenticationService) {
    this.tags = this.productService.getAllTags();
  }

  ngOnInit() {
    this.userService.getUserInfo(this.username).subscribe(
      result => {
        this.currentUserInfo = result;
        if (this.currentUserInfo != undefined) {
          this.hasPortrait = (this.currentUserInfo.headPortraitUrl != '');
        }
      }
    )

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

  onUpdate() {
    let passwordCtrl = <HTMLInputElement>document.getElementById('password');
    let passwordValue = passwordCtrl.value;

    let emailCtrl = document.getElementById('email');
    let emailValue = emailCtrl.innerHTML;

    let portrainCtrl = document.getElementById('portraitImg');
    let protraitValue = portrainCtrl.getAttribute('src');
    if (protraitValue == 'assets/defaultProfile.png') {
      protraitValue = '';
    }

    let newInfo = new UpdateInfo(this.currentUserInfo.username,
                                 '', protraitValue, '', emailValue)
    if (passwordValue != '') {
      newInfo.password = this.userService.encode(this.currentUserInfo.username, passwordValue);
    }
    
    this.userService.updateUserInfo(this.currentUserInfo.username, newInfo).subscribe(
      result => {
        if (result != null) {
            if (result.hasOwnProperty('error')) {
                this.errorInfo = result['error'];
            } else {
              let user = this.authService.currentUser;
              user.headPortraitUrl = result;
              this.authService.saveUserAuthentication(JSON.stringify(user));
              location.reload(true);
            }
        }
    });
  }
}

