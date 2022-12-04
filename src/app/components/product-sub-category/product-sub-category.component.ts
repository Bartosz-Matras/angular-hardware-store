import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: ['./product-sub-category.component.css']
})
export class ProductSubCategoryComponent implements OnInit {

  products: Product[] = [];
  currentCategoryName: string = "";
  currentCategoryId: number = 1;
  currentSubCategoryName: string = "";
  currentSubCategoryId: number = 1;

  searchMode: boolean = false;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyWord = this.route.snapshot.paramMap.get('keyword')!;
    this.searchProducts(theKeyWord);
  }

  handleListProducts(): void {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      this.currentSubCategoryId = +this.route.snapshot.paramMap.get('id2')!;
      this.currentSubCategoryName = this.route.snapshot.paramMap.get('name2')!;
      this.currentCategoryId  = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      this.searchSubProducts(this.currentSubCategoryId);
    }else {
      this.router.navigateByUrl(`/category`);
    }                                   
  }

  searchProducts(theKeyWord: string) {
    this.productService.searchProducts(theKeyWord).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  searchSubProducts(id: number) {
    this.productService.getProductsSubCategory(id).subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
