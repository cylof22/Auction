import { Component, OnInit, Input } from '@angular/core';
import { Product } from './../product.model/product';
import { Review } from '../product.model/review';
import { Followee } from '../product.model/followee';
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
  followees : Followee[];

  validUser : boolean;
  currentUser: string;

  newComment: string;
  newRating: number;

  commentCount: number;
  followeeCount: number;

  errorMessage: string;

  isReviewHidden: boolean = true;
  isFollowee: boolean = false;

  constructor(private productService: ProductService, private authService: AuthenticationService) { 
    this.currentUser = this.authService.currentUser.username;
    this.followeeCount = 0;
    this.commentCount = 0;
    this.validUser = true;
  }

  ngOnInit() {
    this.productService.getReviewsForProduct(this.product.id)
    .retryWhen(errors => {
      return errors
        .delay(10000) // Retry every 2 seconds
        //.take(3)   // Max number of retries
        .do(() => this.errorMessage += '.'); // Update the UI
    })
    .finally(() => this.errorMessage = null)
    .subscribe(
        reviews => { 
          this.reviews = reviews;
          if(reviews != null) {
            this.commentCount = this.reviews.length;
            this.isReviewHidden = this.reviews != null || this.reviews.find(x => x.user == this.currentUser) == null;
          }
        },
        error => { 
          this.isReviewHidden = true;
          console.error(error);
        }
    )

    this.productService.getFolloweeForProduct(this.product.id)
      .retryWhen(errors => {
        return errors
          .delay(2000)
          .do(() => this.errorMessage += '.');
      })
      .finally(() => this.errorMessage = null)
      .subscribe(
        followees => {
          this.followees = followees;
          if(followees != null) {
            this.followeeCount = this.followees.length;
            this.isFollowee = this.followees.find(x => x.user == this.currentUser) == null;
          } else {
            this.isFollowee = false;
          }
        },
        error => {
          console.error(error)
        }
      )
  
    this.validUser = this.currentUser == this.product.owner || this.currentUser.length == 0;
  }

  onAddReview() {
    // check duplicated user
    if(this.reviews != null) {
      let existReview = this.reviews.find(x => x.user == this.currentUser)
      if(existReview != null) {
        alert("Don't add duplicated review")
        return 
      }
    }
    
    this.isReviewHidden = !this.isReviewHidden;
  }

  addReview() {
    // generate random id
    let review = new Review(0, this.product.id, new Date(), this.currentUser,
      this.newRating, this.newComment);

    // post the review data
    this.productService.addReviewForProduct(this.product.id, review).subscribe( resp => {
      if (resp != null) {
        alert(resp.status);
        return ;
      }
    });

    if(this.reviews == null) {
      this.reviews = [review] 
    } else {
      this.reviews = [...this.reviews, review];
    }
    
    this.product.rating = this.averageRating(this.reviews);
    this.commentCount += 1;
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
    let followee = new Followee(this.product.id, this.currentUser, new Date());

     // post the followee data
     this.productService.addFolloweeForProduct(this.product.id, followee).subscribe( resp => {
      if (resp != null) {
        alert(resp.error);
        return ;
      } else {
        this.isFollowee = true;
        this.followeeCount += 1;
      }
    });
  }

  unfollow() {
    // delete the followee data
    this.productService.deleteFolloweeForProduct(this.product.id, this.currentUser).subscribe( resp => {
      if(resp != null) {
        alert(resp.error);
        return ;
      } else {
        this.isFollowee = false;
        this.followeeCount -= 1;
      }
    });
  }
}
