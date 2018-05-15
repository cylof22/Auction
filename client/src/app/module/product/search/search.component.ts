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
  searchTypes: string[];
  selectedType: string;

  constructor(private productService: ProductService) {

    const fb = new FormBuilder();
    this.formModel = fb.group({
      'searchTypes': ['']
    })

    this.selectedType = "Tag";
  }

  ngOnInit() {
    this.searchTypes = this.productService.getSearchTypes();
    this.selectedType = this.searchTypes[0];
  }

  onSearch(event) {
    if (this.formModel.valid) {
      let selectedType = event.target.text;
      if(selectedType != null) {
        this.selectedType = event.target.text;
        this.productService.searchEvent.emit(this.formModel.value);
      }
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