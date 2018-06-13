import { Component, OnInit, Input } from '@angular/core';
import { Product } from './../product.model/product';
import { Review } from '../product.model/review';
import { ProductService } from '../service/product.service';
import { AuthenticationService } from '../../authentication/services/authentication.service';

@Component({
  selector: 'auction-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() product: Product;
  reviews: Review[];

  newComment: string;
  newRating: number;

  isReviewHidden: boolean = true;

  constructor(private productService: ProductService, private authService: AuthenticationService) { 
    
  }

  ngOnInit() {
    this.productService
      .getReviewsForProduct(this.product.id)
      .subscribe(
        reviews => this.reviews = reviews,
        error => console.error(error));
  }

  addReview() {
    // Get user infor
    let userName = this.authService.currentUser.username;
    if(userName.length == 0) {
      userName = 'Anonymous';
    }

    let review = new Review(0, this.product.id, new Date(), userName,
      this.newRating, this.newComment);

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
}
