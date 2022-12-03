import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductSubCategory } from 'src/app/common/product-sub-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  productCategories: ProductCategory[] = [];
  productSubCategories: ProductSubCategory[] = [];

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  currentCategoryName: string = "";

  searchMode: boolean = false;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

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
    console.log(theKeyWord)
    this.searchProducts(theKeyWord);
    this.listProductCategories();
  }

  handleListProducts(): void {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      this.listProductsSubCategories();
      this.listProductsBySubCategoryId(this.currentCategoryId);
    }else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'NOŻE i OSTRZA';
      this.listProductCategories();
      this.listAllProducts();
    }                                      
  }

  
  searchProducts(theKeyWord: string) {
    this.productService.searchProducts(theKeyWord).subscribe(
      data => {
        this.products = data;
      }
    );
  }


  listProductsSubCategories() {
    this.productService.getProductSubCategories(this.currentCategoryId).subscribe(
      data => {
        this.productSubCategories = data;
      }
    );
  }

  listProductsBySubCategoryId(id: number) {
    this.productService.getProductList(id).subscribe(
      data => {
        this.products = data;
      }
    );
  }



  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    );
  }

  listAllProducts() {
    this.productService.getProductList(-1).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
