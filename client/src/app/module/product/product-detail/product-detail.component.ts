import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Product } from '../product.model/product'
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

  newComment: string;
  newRating: number;

  isReviewHidden: boolean = true;
  isWatching: boolean = false;
  imgHtml: SafeHtml;

  productType: string;
  priceType: string;
  price: string;
  hasStory: boolean;
  hasStoryPic: boolean;

  private subscription: Subscription;

  constructor(private productService: ProductService,
              private bidService: BidService,
              private sanitizer: DomSanitizer,
              router: ActivatedRoute) {

    this.imgHtml = sanitizer.bypassSecurityTrustHtml(`
      <img src="http://placehold.it/820x320">`);

    const productId = router.snapshot.params['productId'];

    this.productService
      .getProductById(productId)
      .subscribe(
        product => {
          this.product = product;
          if (this.product.maker == "") {
            this.product.maker = this.product.owner;
          }
          this.setProductType(product);
          this.setPrice(product);
          this.setStoryInfo(product);
        },
        error => console.error(error));
  }

  ngOnInit() {
  }

  setProductType(product: Product) {
    switch (parseInt(product.type)) {
      case 0:
      this.productType = "Digital picture";
      break;
      case 1:
      this.productType = "Material object"
      break;
    }
  }

  setPrice(product: Product) {
    this.price = product.price.value;
    switch (parseInt(product.price.type)) {
      case 0:
      this.priceType = "Fixed Price";
      break;
      case 1:
      this.priceType = "Auction Price";
      break;
      case 2:
      this.priceType = "Only Exhibition"
      break;
    }
  }

  setStoryInfo(product: Product) {
    this.hasStory = false;
    if (product.story != undefined) {
      this.hasStoryPic = false;
      if (product.story.pictures.length > 0) {
        this.hasStoryPic = true;

        if (product.story.description != "") {
          this.hasStory = true;
        }
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
    //location.href = "/#/wallet";
  }
}
