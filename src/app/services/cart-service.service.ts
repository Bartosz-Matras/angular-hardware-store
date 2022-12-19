import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { CartProduct } from '../common/cart-product';
import { Discount } from '../common/discount';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  cartProducts: CartProduct[] = [];

  wholePrice: Subject<number> = new Subject<number>();
  wholeQuantity: Subject<number> = new Subject<number>();
  numberOfProducts: Subject<number> = new Subject<number>();

  sendWholePrice: Subject<number> = new ReplaySubject<number>();
  sendWholeQuantity: Subject<number> = new ReplaySubject<number>();
  sendShippingCost: Subject<string> = new ReplaySubject<string>();

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
      if(existingProduct!.unitsInStock > existingProduct!.quantity){
        existingProduct!.quantity++;
      }
     
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
    this.numberOfProducts.next(this.cartProducts.length);

    this.persistCartProducst();
  }

  persistCartProducst() {
    sessionStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }

  getDiscount(code: string): Observable<Discount> {
    const discountUrl = `http://localhost:8080/api/discounts/search/findDiscountByDiscountCode?discountCode=${code}`;
    return this.httpClient.get<Discount>(discountUrl);
  }

  decrementQuantity(theCartProduct: CartProduct) {

    theCartProduct.quantity--;

    if (theCartProduct.quantity === 0) {
      this.remove(theCartProduct);
    }else {
      this.computeWholePriceAndQuantity();
    }
  }

  remove(theCartProduct: CartProduct) {
    const productIndex = this.cartProducts
        .findIndex(tempCartProduct => tempCartProduct.id === theCartProduct.id);

    if(productIndex > -1) {
      this.cartProducts.splice(productIndex, 1);

      this.computeWholePriceAndQuantity();
    }
  }

  saveData(wPrice: number, wQuantity: number, sPrice: string) {
    this.sendWholePrice.next(wPrice);
    this.sendShippingCost.next(sPrice);
    this.sendWholeQuantity.next(wQuantity);
  }
}
