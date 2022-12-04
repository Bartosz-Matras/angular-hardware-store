import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../common/product';
import { ProductAlsoBought } from '../common/product-also-bought';
import { ProductAlsoWatched } from '../common/product-also-watched';
import { ProductOne } from '../common/product-one';
import { ProductTwo } from '../common/product-two';

@Injectable({
  providedIn: 'root'
})
export class CorrelationServiceService {


  private productAlsoBoughtUrl = "http://localhost:8080/api/productsAlsoBought";
  private productAlsoWatchedUrl = "http://localhost:8080/api/productsAlsoWatched";
  private productsUrl = "http://localhost:8080/api/products";
  private productOneUrl = "http://localhost:8080/api/productsOne"; 
  private productTwoUrl = "http://localhost:8080/api/productsTwo";


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

  get5Products(numbers: string): Observable<Product[]> {
    const url = `${this.productsUrl}/search/findProductByIdIn?ids=${numbers}`;
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductOneBySku(sku: string): Observable<ProductOne> {
    const url = `${this.productOneUrl}/search/findScrapperProductPageOneBySku?sku=${sku}`;
    return this.httpClient.get<ProductOne>(url);
  }

  getProductTwoBySku(sku: string): Observable<ProductTwo> {
    const url = `${this.productTwoUrl}/search/findScrapperProductPageTwoBySku?sku=${sku}`;
    return this.httpClient.get<ProductTwo>(url);
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

