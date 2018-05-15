import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service'

@Component({
  selector: 'auction-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  searchTypes: string[];
  selectedType: string;
  searchText: string;

  constructor(private productService: ProductService) {
    this.selectedType = "Tag";
    this.searchText = "";
  }

  ngOnInit() {
    this.searchTypes = this.productService.getSearchTypes();
    this.selectedType = this.searchTypes[0];
  }

  OnSelecteSearchType(event) {
    let selectedType = event.target.text;
      if(selectedType != null) {
        this.selectedType = event.target.text;
    }
  }

  OnSearch() {
    let searchTextElem = document.getElementById("SearchInfo") as HTMLInputElement;
    this.searchText = searchTextElem.value;
    alert(this.searchText)
    if(this.searchText.length != 0) {
      let key = this.selectedType as string;
      let searchParas = {
        key: this.searchText,
      } 
      this.productService.searchEvent.emit(searchParas);
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