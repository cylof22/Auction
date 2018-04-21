import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Product, PicAuth } from '../product.model/product'
import { Review } from '../product.model/review';
import { ProductService } from '../service/product.service';

import { BidService } from './bid.service';

@Component({
  selector: 'auction-product-page',
  styleUrls: [ './product-detail.component.css' ],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnDestroy {
  product: Product;
  reviews: Review[];

  currentBid: number;
  newComment: string;
  newRating: number;

  isReviewHidden: boolean = true;
  isWatching: boolean = false;
  imgHtml: SafeHtml;
  readonly: boolean = true;
  showPicAuth: boolean = false;

  private subscription: Subscription;

  constructor(private productService: ProductService,
              private bidService: BidService,
              private sanitizer: DomSanitizer,
              router: ActivatedRoute) {

    this.imgHtml = sanitizer.bypassSecurityTrustHtml(`
      <img src="http://placehold.it/820x320">`);

    const productId = router.snapshot.params['productId'];

    if  (router.snapshot.params['readonly'] == 'false') {
      this.readonly = false;
    }

    this.productService
      .getProductById(productId)
      .subscribe(
        product => {
          this.product = product;
          this.currentBid = product.price;

          if (this.product.hasOwnProperty('picAuth')) {
            if (this.product.picAuth.isPublic) {
              this.showPicAuth = true;
            }
          }
        },
        error => console.error(error));

    this.productService
      .getReviewsForProduct(productId)
      .subscribe(
        reviews => this.reviews = reviews,
        error => console.error(error));
  }

  ngOnInit() {
    let img = document.getElementById("imagePreview");
    let detailBox = document.getElementById("detailBox");
    detailBox.style.height = img.style.height;

    // update some controls
    if (!this.readonly) {
      // set some control editable
      var editItems = document.getElementsByClassName("editItem");
      for (var i = 0; i < editItems.length; i++) {
        editItems[i].setAttribute("contentEditable", "true");
      }
    }
  }

  toggleWatchProduct() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.isWatching = false;
    } else {
      this.isWatching = true;
      this.subscription = this.bidService.watchProduct(this.product.id)
        .subscribe(
          products => this.currentBid = products.find((p: any) => p.productId === this.product.id).bid,
          error => console.log(error));
    }
  }

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    return Promise.resolve(true);
  }

  addReview() {
    let review = new Review(0, this.product.id, new Date(), 'Anonymous',
      this.newRating, this.newComment);
    this.reviews = [...this.reviews, review];
    this.product.rating = this.averageRating(this.reviews);

    this.resetForm();
  }

  averageRating(reviews: Review[]) {
    let sum = reviews.reduce((average, review) => average + review.rating, 0);
    return sum / reviews.length;
  }

  resetForm() {
    this.newRating = 0;
    this.newComment = null;
    this.isReviewHidden = true;
  }

  onBuyWithDigitalCash() {
    location.href = "/#/wallet";
  }
}
