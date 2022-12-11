import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartProduct } from 'src/app/common/cart-product';
import { Discount } from 'src/app/common/discount';
import { Product } from 'src/app/common/product';
import { ProductAlsoBought } from 'src/app/common/product-also-bought';
import { ProductAlsoWatched } from 'src/app/common/product-also-watched';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CorrelationServiceService } from 'src/app/services/correlation-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartProducts: CartProduct[] = [];
  productAlsoBought: Product[] | undefined;
  productAlsoWatched: Product[] | undefined;
  discount: Discount | undefined;
  wholePrice: number = 0;
  wholeQuantity: number = 0;
  codeIsValid: boolean = false;
  discountClicked: boolean = false;
  discountWholePrice: string = "";

  constructor(private cartService: CartServiceService,
              private correlationService: CorrelationServiceService) { }

  ngOnInit(): void {
    this.listCartProducts();
    this.handleProductsCorrelation();
  }

  listCartProducts() {
    this.cartProducts = this.cartService.cartProducts;

    this.cartService.wholePrice.subscribe(
      data => this.wholePrice = data
    );

    this.cartService.wholeQuantity.subscribe(
      data => this.wholeQuantity = data
    );

    this.cartService.computeWholePriceAndQuantity();
  }

  handleProductsCorrelation() {
    this.correlationService.getAllProductsAlsoBought().subscribe(
      data => {
        var indexes = this.get5ProductsAlsoBought(data);
        this.correlationService.get5Products(indexes).subscribe(
          data => {
            this.productAlsoBought = data;
          }
        );
      }
    );

    this.correlationService.getAllProductsAlsoWatched().subscribe(
      data => {
        var indexes = this.get5ProductsAlsoWatched(data);
        this.correlationService.get5Products(indexes).subscribe(
          data => {
            this.productAlsoWatched = data;
          }
        );
      }
    );
  }

  get5ProductsAlsoBought(data: ProductAlsoBought[]): string {
    var indexes = new Array<Number>;
    var i : number = 0;

    for(var element of data) {
      if(!indexes.includes(element.idFatherProduct)) {
        indexes.push(element.idFatherProduct);
        i++;
      }

      if (i === 5) {
        break;
      }
    }
    return indexes.toString();
  }

  get5ProductsAlsoWatched(data: ProductAlsoWatched[]) : string {
    var indexes = new Array<Number>;
    var i : number = 0;

    for(var element of data){
      if (!indexes.includes(element.idFatherProduct)) {
        indexes.push(element.idFatherProduct);
        i++;
      }

      if (i === 5){
        break;
      }
    }
    return indexes.toString();
  }

  doDiscount(value: string) {
    this.discountClicked = true;

    this.cartService.getDiscount(value).subscribe(
      data => {
        this.discount = data;
        if(this.discount != undefined) {
          this.codeIsValid = true;
        }
        this.discountWholePrice = ((this.wholePrice * (100 - +this.discount.discountPercent))/ 100).toFixed(2);
      }
    );
  }


}
