import { Component, Input } from '@angular/core';

import { ConcernedUser } from './../../../user.model/user'

@Component({
  selector: 'user-concernuser-page',
  styleUrls: [ './user.concernuser.component.css' ],
  templateUrl: './user.concernuser.component.html'
})

export class ConcernUserComponent {
  @Input('user') concernedUser: ConcernedUser;

  constructor() {
  }

  ngOnInit() {
  }
}

