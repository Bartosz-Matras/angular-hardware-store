import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { ProductDetails } from '../common/product-details';
import { ProductSubCategory } from '../common/product-sub-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private categoryUrl = 'http://localhost:8080/api/productsCategory';
  private subCategoryUrl = 'http://localhost:8080/api/productsSubCategory';
  private productUrl = 'http://localhost:8080/api/products';
  private productDetailsUrl = 'http://localhost:8080/api/productsDetails';

  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]>{
    const categoryUrlSize = `${this.categoryUrl}?size=40`

    return this.httpClient.get<GetResponseProductsCategory>(categoryUrlSize).pipe(
      map(response => response._embedded.productsCategory)
    );
  }

  getProductSubCategories(id: number): Observable<ProductSubCategory[]>{

    const productSubCategoryUrl = `${this.subCategoryUrl}` +
          `/search/findProductSubCategoryByProductCategoryId?id=${id}`;

    return this.httpClient.get<GetResponseProductsSubCategory>(productSubCategoryUrl).pipe(
      map(response => response._embedded.productsSubCategory)
    );
  }



  searchProducts(theKeyWord: string): Observable<Product[]> {
 
    // need to build URL based on keyword
    const searchUrl = `${this.productUrl}/search/findByNameContaining?name=${theKeyWord}`;
    console.log(searchUrl);
    return this.getProducts(searchUrl);
  }



  getProductList(id: number): Observable<Product[]> {
    if(id === -1){
      const searchUrl = `${this.productUrl}?size=5`
      return this.getProducts(this.productUrl);
    }else{
      const searchUrl = `${this.productUrl}/search/findProductByProductSubCategoryId?id=${id}`
      return this.getProductBySubCategory(searchUrl);
    }
  }

  private getProductBySubCategory(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  private getProducts(searchUrl: string): Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }



  getProduct(id: string): Observable<Product> {
    const url = `${this.productUrl}/search/findProductById?id=${id}`;
    return this.httpClient.get<Product>(url);
  }

  getProductDetails(id: string) : Observable<ProductDetails> {
    const url = `${this.productDetailsUrl}/search/findProductDetailsByProductId?id=${id}`;
    return this.httpClient.get<ProductDetails>(url);
  }


}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductsCategory {
  _embedded: {
    productsCategory: ProductCategory[];
  }
}

interface GetResponseProductsSubCategory {
  _embedded: {
    productsSubCategory: ProductSubCategory[];
  }
}

