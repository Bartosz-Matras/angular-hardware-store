import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CartProduct } from '../common/cart-product';
import { Discount } from '../common/discount';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  cartProducts: CartProduct[] = [];

  wholePrice: Subject<number> = new Subject<number>();
  wholeQuantity: Subject<number> = new Subject<number>();

  constructor(private httpClient: HttpClient) {
    this.cartProducts = JSON.parse(sessionStorage.getItem('cartProducts')!) != null 
        ? JSON.parse(sessionStorage.getItem('cartProducts')!):[];
  }

  addToCart(theCartProduct: CartProduct) {
    let productExistsInCart: boolean = false;
    let existingProduct: CartProduct | undefined;

    if (this.cartProducts.length > 0) {
      
      existingProduct = this.cartProducts
        .find(tempCardProduct => tempCardProduct.id === theCartProduct.id);

      productExistsInCart = (existingProduct != undefined);
    }

    if (productExistsInCart) {
      existingProduct!.quantity++;
    }else {
      this.cartProducts.push(theCartProduct);
    }

    this.computeWholePriceAndQuantity();  
  }

  computeWholePriceAndQuantity() {
    let wholePriceValue: number = 0;
    let wholeQuantityValue: number = 0;

    for (let tempProduct of this.cartProducts) {
      wholePriceValue += tempProduct.quantity * tempProduct.unitPrice;
      wholeQuantityValue += tempProduct.quantity;
    }

    this.wholePrice.next(+wholePriceValue.toFixed(2));
    this.wholeQuantity.next(wholeQuantityValue);

    this.persistCartProducst();
  }

  persistCartProducst() {
    sessionStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }

  getDiscount(code: string): Observable<Discount> {
    const discountUrl = `http://localhost:8080/api/discounts/search/findDiscountByDiscountCode?discountCode=${code}`;
    return this.httpClient.get<Discount>(discountUrl);
  }
}
