import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from './../service/user.service'
import { Wallet } from './../user.model/user'

@Component({
  selector: 'user-wallet-page',
  styleUrls: [ './user.wallet.component.css' ],
  templateUrl: './user.wallet.component.html'
})

export class UserWalletComponent {
    @Input("username") username: string;
    wallet: Wallet;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        // this.userService.getWalletInfo(this.username).subscribe(
        //     result => this.wallet = result
        // )

        //this.test();
    }

    test() {
        this.wallet = new Wallet('1687', 'iejfiejfoajejfloefkfhdaoijfafila');
    }
}

