import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartProduct } from 'src/app/common/cart-product';
import { Product } from 'src/app/common/product';
import { ProductAlsoBought } from 'src/app/common/product-also-bought';
import { ProductAlsoWatched } from 'src/app/common/product-also-watched';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductDetails } from 'src/app/common/product-details';
import { ScrapperProduct } from 'src/app/common/scrapper-product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CorrelationServiceService } from 'src/app/services/correlation-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productCategoryName: string = "";
  productCategoryId: number = 0;
  productSubCategoryName: string = "";
  productSubCategoryId: number = 0;

  categoryIdExist: boolean = false;
  categoryNameExist: boolean = false;

  subCategoryIdExist: boolean = false;
  subCategoryNameExist: boolean = false;


  productCategories: ProductCategory[] = [];
  product: Product | undefined;
  productDetails: ProductDetails | undefined;
  hasProductId: boolean = false;

  productAlsoBought: Product[] | undefined;
  productAlsoWatched: Product[] | undefined;
  scrappedProduct: ScrapperProduct[] | undefined;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private correlationService: CorrelationServiceService,
              private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.categoryIdExist = this.route.snapshot.paramMap.has('idC');
    this.categoryNameExist = this.route.snapshot.paramMap.has('nameC');
    if(this.categoryIdExist && this.categoryNameExist){
      this.productCategoryId = +this.route.snapshot.paramMap.get('idC')!;
      this.productCategoryName = this.route.snapshot.paramMap.get('nameC')!;
    }

    this.subCategoryIdExist = this.route.snapshot.paramMap.has('idS');
    this.subCategoryNameExist = this.route.snapshot.paramMap.has('nameS');
    
    if(this.subCategoryIdExist && this.subCategoryNameExist){
      this.productSubCategoryId = +this.route.snapshot.paramMap.get('idS')!;
      this.productSubCategoryName = this.route.snapshot.paramMap.get('nameS')!;  
    }

    this.listProductCategories();

    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
      this.handleProductsCorrelation();
      this.cartService.computeWholePriceAndQuantity();
    });
  }

  

  handleProductDetails() {
    this.hasProductId = this.route.snapshot.paramMap.has('id');

    if(this.hasProductId){
      const productId = this.route.snapshot.paramMap.get('id')!;
      this.getProduct(productId);
    }
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    );
  }

  getProduct(id: string) {
    this.productService.getProduct(id).subscribe(
      data => {
        this.product = data;
        this.getProductDetails(this.product.id.toString());
        this.getScrappedProduct(this.product.sku.toString());
        this.handleProductAlsoWatched(this.product.id.toString())
      }
    );
  }

  getScrappedProduct(sku: string) {
    this.correlationService.getProductBySku(sku).subscribe(
      data => {
        this.scrappedProduct = data;
      }
    )
  }

  getProductDetails(id: string) {
    this.productService.getProductDetails(id).subscribe(
      data => {
        this.productDetails = data;
      }
    );
  }

  handleProductsCorrelation() {
    if(this.cartService.cartProducts.length > 0){
      var cartProductsId = this.cartService.cartProducts.map(item => item.id);
      this.correlationService.getProductAlsoBoughtByIdFather(cartProductsId).subscribe(
        data => {
          var indexes = this.get5ProductsAlsoBought(data);
          this.correlationService.get5Products(indexes).subscribe(
            data => {
              this.productAlsoBought = data;
            }
          );
        }
      );
    }else {
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
    }
    

    if(this.cartService.cartProducts.length > 0) {
      var cartProductsId = this.cartService.cartProducts.map(item => item.id);
      this.correlationService.getProductsAlsoWatchedByIdFather(cartProductsId).subscribe(
        data => {
          var indexes = this.get5ProductsAlsoWatched(data);
          this.correlationService.get5Products(indexes).subscribe(
            data => {
              this.productAlsoWatched = data;
            }
          );
        }
      );
    }else {
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
  }


  get5ProductsAlsoBought(data: ProductAlsoBought[]): string {
    var indexes = new Array<Number>;
    var i : number = 0;

    for(var element of data) {
      if(!indexes.includes(element.idProduct)  && this.product?.id != element.idProduct) {
        indexes.push(element.idProduct);
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
      if (!indexes.includes(element.idProduct) && this.product?.id != element.idProduct) {
        indexes.push(element.idProduct);
        i++;
      }

      if (i === 5){
        break;
      }
    }
    return indexes.toString();
  }


  addToCart(tempProduct: Product) {
    const theCartProduct = new CartProduct(tempProduct);

    this.cartService.addToCart(theCartProduct);
  }


  handleProductAlsoWatched(id: string) {
    var tempCartProducts = this.cartService.cartProducts.map(item => item.id);
    if(tempCartProducts.length != 0){
      this.correlationService.updateProductsAlsoWatched(id, tempCartProducts);
    }
  }

}


