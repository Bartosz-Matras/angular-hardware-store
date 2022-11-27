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
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  previousKeyWord: string = "";

  productCategory?: ProductCategory;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.listProducts();
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
    
    if(this.previousKeyWord != theKeyWord){
      this.thePageNumber = 1;
    }

    this.previousKeyWord = theKeyWord;

    console.log(`keyword=${theKeyWord}, thePageNumber=${this.thePageNumber}`)

    // // now search for the products using keyword
    // this.productService.searchProductsPaginate(this.thePageNumber - 1,
    //                                             this.thePageSize,
    //                                             theKeyWord).subscribe(this.processResult())

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

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)
    // this.productService.getProductListPaginate(this.thePageNumber - 1,
    //                                             this.thePageSize,
    //                                             this.currentCategoryId).subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
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

  listAllProducts() {
    this.productService.getProductList(-1).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
