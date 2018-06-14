import { Component, OnInit, Input } from '@angular/core';
import { Product } from './../product.model/product';
import { Review } from '../product.model/review';
import { ProductService } from '../service/product.service';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'auction-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() product: Product;
  reviews: Review[];

  validUser : boolean;

  currentUser: string;

  newComment: string;
  newRating: number;

  isReviewHidden: boolean = true;
  isFollowee: boolean = false;

  constructor(private productService: ProductService, private authService: AuthenticationService) { 
    this.validUser = true;
    this.currentUser = this.authService.currentUser.username;
    //this.validUser = this.currentUser == this.product.owner || this.currentUser.length == 0;
  }

  ngOnInit() {
    this.productService.getReviewsForProduct(this.product.id)
      .subscribe(
        reviews => { 
          this.reviews = reviews;
          this.isReviewHidden = this.reviews == null || this.reviews.length == 0;
        },
        error => { 
          this.isReviewHidden = true;
          console.error(error);
        }
      )
  }

  addReview() {
    let review = new Review(0, this.product.id, new Date(), this.currentUser,
      this.newRating, this.newComment);

    // post the review data
    var errResp: HttpErrorResponse;
    this.productService.addReviewForProduct(this.product.id, review).subscribe( resp => errResp = resp);
    if (errResp.status != 200) {
      alert(errResp.statusText);
      return ;
    }
    
    if(this.reviews == null) {
      this.reviews = [review] 
    } else {
      this.reviews = [...this.reviews, review];
    }
    
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

  followme() {
    this.isFollowee = true;
  }

  unfollow() {
   this.isFollowee = false;
  }
}
