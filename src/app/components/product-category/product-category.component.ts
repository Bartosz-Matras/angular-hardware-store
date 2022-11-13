import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductSubCategory } from 'src/app/common/product-sub-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  productCategories: ProductCategory[] = [];
  productSubCategories: ProductSubCategory[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  listProductSubCategories(id: number): ProductSubCategory[] {
    
    this.productService.getProductSubCategories(id).subscribe(
      data => {
        console.log('Product Sub Categories=' + JSON.stringify(data));
        // this.productSubCategories = [];
        this.productSubCategories = data;
      }
    );

    return this.productSubCategories;
  }

}
