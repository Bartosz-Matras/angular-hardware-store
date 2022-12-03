import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { RouterModule, Routes } from '@angular/router';
import { ProductSubCategoryComponent } from './components/product-sub-category/product-sub-category.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';

const routes: Routes = [
  {path: 'search/:keyword', component: ProductCategoryComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'category', component: ProductCategoryComponent},
  {path: 'category/:id/:name', component: ProductCategoryComponent},
  {path: 'subCategory/:id/:name', component: ProductSubCategoryComponent},
  {path: '', redirectTo: '/category', pathMatch: 'full'},
  {path: '**', redirectTo: '/category', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    ProductCategoryComponent,
    ProductSubCategoryComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
