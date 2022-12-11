import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartProduct } from 'src/app/common/cart-product';
import { Product } from 'src/app/common/product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: ['./product-sub-category.component.css']
})
export class ProductSubCategoryComponent implements OnInit {

  basicSortString: string = "boughtNumber";

  products: Product[] = [];
  currentCategoryName: string = "";
  currentCategoryId: number = 1;
  currentSubCategoryName: string = "";
  currentSubCategoryId: number = 1;

  searchMode: boolean = false;

  previousSubCategoryId: number = 1;

  thePageNumber: number = 1;
  thePageSize: number = 20;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router,
              private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts(this.basicSortString);
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
      this.currentSubCategoryId = +this.route.snapshot.paramMap.get('id2')!;
      this.currentSubCategoryName = this.route.snapshot.paramMap.get('name2')!;
      this.currentCategoryId  = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      if(this.previousSubCategoryId != this.currentSubCategoryId){
        this.thePageNumber = 1;
      }
      this.searchSubProducts(this.currentSubCategoryId, sortString);
      this.previousSubCategoryId = this.currentCategoryId;
    }else {
      this.router.navigateByUrl(`/category`);
    }                                   
  }

  searchSubProducts(id: number, sortString: string) {
    this.productService.getProductsSubCategory(this.thePageNumber - 1,
                                              this.thePageSize,
                                              sortString,
                                              id).subscribe(
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
