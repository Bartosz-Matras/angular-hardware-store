import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartProduct } from 'src/app/common/cart-product';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductSubCategory } from 'src/app/common/product-sub-category';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  basicSortString: string = "boughtNumber";

  productCategories: ProductCategory[] = [];
  productSubCategories: ProductSubCategory[] = [];

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";

  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 20;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts(this.basicSortString);
      this.cartService.computeWholePriceAndQuantity();
    });
  }


  listProducts(sortString: string) {
    window.scroll(0,0);
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts(sortString);
    }else{
      this.handleListProducts(sortString);
    }
  }


  handleSearchProducts(sortString: string) {
    const theKeyWord = this.route.snapshot.paramMap.get('keyword')!;
    this.searchProducts(theKeyWord, sortString);
    this.listProductCategories();
  }

  searchProducts(theKeyWord: string, sortString: string) {
    this.productService.searchProducts(this.thePageNumber - 1,
                                      this.thePageSize,
                                      theKeyWord,
                                      sortString).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }


  
  handleListProducts(sortString: string): void {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      if(this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber = 1;
      }  
      this.listProductsSubCategories(sortString);
      this.previousCategoryId = this.currentCategoryId;
    }else {
      this.listProductCategories();
      this.listAllProducts(sortString);
    }                                      
  }

  listProductsSubCategories(sortString: string) {
    this.productService.getProductSubCategories(this.currentCategoryId).subscribe(
      data => {
        this.productSubCategories = data;
        var indexes = this.getIds(data);
        this.productService.getProductsSubCategories(this.thePageNumber - 1,
                                                      this.thePageSize,
                                                      sortString,
                                                      indexes.toString()).subscribe(
          data => {
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
          }
        );
      }
    );
  }

  getIds(data: ProductSubCategory[]){
    var indexes = new Array<Number>;
  
    for (var element of data){
      indexes.push(element.id);
    }

    return indexes;
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    );
  }

  listAllProducts(sortString: string) {
    this.productService.getProductList(this.thePageNumber - 1, this.thePageSize, sortString).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }



  updatePageSize(pageSizeValue: string) {
    this.thePageSize = +pageSizeValue;
    this.thePageNumber = 1;
    this.listProducts(this.basicSortString);
  }

  updateProductsSort(pageSortValue: string) {
    this.thePageNumber = 1;

    if(pageSortValue === "Cena"){
      this.basicSortString = "unitPrice";
    }else if (pageSortValue === "Alfabetycznie") {
      this.basicSortString = "name";
    }else if (pageSortValue === "Najczęściej kupowane"){
      this.basicSortString = "boughtNumber";
    }

    this.listProducts(this.basicSortString);
  }


  addToCart(tempProduct: Product) {
    const theCartProduct = new CartProduct(tempProduct);

    this.cartService.addToCart(theCartProduct);
  }
}
