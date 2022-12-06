import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductAlsoBought } from 'src/app/common/product-also-bought';
import { ProductAlsoWatched } from 'src/app/common/product-also-watched';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductDetails } from 'src/app/common/product-details';
import { ScrapperProduct } from 'src/app/common/scrapper-product';
import { CorrelationServiceService } from 'src/app/services/correlation-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productCategories: ProductCategory[] = [];
  product: Product | undefined;
  productDetails: ProductDetails | undefined;
  hasProductId: boolean = false;

  productAlsoBought: Product[] | undefined;
  productAlsoWatched: Product[] | undefined;
  scrappedProduct: ScrapperProduct[] | undefined;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private correlationService: CorrelationServiceService) { }

  ngOnInit(): void {
    this.listProductCategories();

    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
      this.handleProductsCorrelation();
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
      }
    );
  }

  getScrappedProduct(sku: string) {
    this.correlationService.getProductBySku(sku).subscribe(
      data => {
        console.log(data);
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
    this.correlationService.getAllProductsAlsoBought().subscribe(
      data => {
        var indexes = this.get5ProductsAlsoBought(data);
        this.correlationService.get5Products(indexes).subscribe(
          data => {
            console.log(data);
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
            console.log(data);
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

}


