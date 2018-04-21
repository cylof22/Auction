import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PicAuth } from '../product.model/product';

@Component({
  selector: 'auction-product-auth',
  templateUrl: './product-auth.component.html',
  styleUrls: ['./product-auth.component.css']
})
export class ProductAuthComponent {
  @Input() picAuth: PicAuth;
  @Input() readonly: boolean = true;
  hasAuthInfo: boolean = false;

  constructor(router: ActivatedRoute) {
    if  (router.snapshot.params['readonly'] == 'false') {
      this.readonly = false;
    }

    if (router.snapshot.params.hasOwnProperty['picAuth']) {
      this.picAuth = router.snapshot.params['picAuth'];
      if (this.picAuth.authFiles.length > 0 && this.picAuth.authDescrption != "") {
        this.hasAuthInfo = true;
      }
    }
  }

  OnAuthFileAdd(input) {

  }
}
