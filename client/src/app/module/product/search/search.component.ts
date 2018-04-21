import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service'

@Component({
  selector: 'auction-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  formModel: FormGroup;
  categories: string[];

  constructor(private productService: ProductService) {

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'categories': ['']
    })
  }

  ngOnInit() {
    this.categories = this.productService.getAllCategories();
  }

  onSearch() {
    if (this.formModel.valid) {
      this.productService.searchEvent.emit(this.formModel.value);
    }
  }
}

function positiveNumberValidator(control: FormControl): any {
  if (!control.value) return null;
  const price = parseInt(control.value);
  return price === null ||
  typeof price === 'number' &&
  price > 0 ? null : {positivenumber: true};
}