import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../common/product';
import { ProductAlsoBought } from '../common/product-also-bought';
import { ProductAlsoWatched } from '../common/product-also-watched';
import { ScrapperProduct } from '../common/scrapper-product';

@Injectable({
  providedIn: 'root'
})
export class CorrelationServiceService {


  private productAlsoBoughtUrl = "http://localhost:8080/api/productsAlsoBought";
  private productAlsoWatchedUrl = "http://localhost:8080/api/productsAlsoWatched";
  private productsUrl = "http://localhost:8080/api/products";
  private productScrapperUrl = "http://localhost:8080/api/scrapperProducts"; 


  constructor(private httpClient: HttpClient) { }

  getAllProductsAlsoBought(): Observable<ProductAlsoBought[]> {
    const url = `${this.productAlsoBoughtUrl}/search/findAllByOrderByBoughtCountDesc`;
    return this.httpClient.get<GetResponseProductAlsoBought>(url).pipe(
      map(response => response._embedded.productsAlsoBought)
    );
  }

  getAllProductsAlsoWatched(): Observable<ProductAlsoWatched[]> {
    const url = `${this.productAlsoWatchedUrl}/search/findAllByOrderByWatchedCountDesc`;
    return this.httpClient.get<GetResponseProductAlsoWatched>(url).pipe(
      map(response => response._embedded.productsAlsoWatched)
    );
  }

  getProductsAlsoWatchedByIdFather(ids: number[]): Observable<ProductAlsoWatched[]> {
    const url = `${this.productAlsoWatchedUrl}/search/findAllByIdFatherProductInOrderByWatchedCountDesc?ids=${ids}`;
    return this.httpClient.get<GetResponseProductAlsoWatched>(url).pipe(
      map(response => response._embedded.productsAlsoWatched)
    );
  }

  getProductAlsoBoughtByIdFather(ids: number[]): Observable<ProductAlsoBought[]> {
    const url = `${this.productAlsoBoughtUrl}/search/findAllByIdFatherProductInOrderByBoughtCountDesc?ids=${ids}`;
    return this.httpClient.get<GetResponseProductAlsoBought>(url).pipe(
      map(response => response._embedded.productsAlsoBought)
    );
  }

  get5Products(numbers: string): Observable<Product[]> {
    const url = `${this.productsUrl}/search/findProductByIdIn?ids=${numbers}`;
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductBySku(sku: string): Observable<ScrapperProduct[]> {
    const url = `${this.productScrapperUrl}/search/findScrapperProductsBySku?sku=${sku}`;
    return this.httpClient.get<ScrapperProduct[]>(url);
  }

  updateProductsAlsoWatched(id: string, ids: Number[]) {
    const url = `http://localhost:8080/api/discounts/update?ids=${ids}&id=${id}`;
    this.httpClient.get<Number[]>(url).subscribe();
  }


}

interface GetResponseProductAlsoBought {
  _embedded: {
    productsAlsoBought: ProductAlsoBought[];
  }
}

interface GetResponseProductAlsoWatched {
  _embedded: {
    productsAlsoWatched: ProductAlsoWatched[];
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

