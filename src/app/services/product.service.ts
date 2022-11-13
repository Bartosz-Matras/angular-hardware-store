import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ProductCategory } from '../common/product-category';
import { ProductSubCategory } from '../common/product-sub-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private categoryUrl = 'http://localhost:8080/api/productsCategory';
  private subCategoryUrl = 'http://localhost:8080/api/productsSubCategory';

  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductsCategory>(this.categoryUrl).pipe(
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