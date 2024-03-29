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

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {path: 'search/:keyword', component: ProductCategoryComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'products/:id/:idC/:nameC', component: ProductDetailsComponent},
  {path: 'products/:id/:idC/:nameC/:idS/:nameS', component: ProductDetailsComponent},
  {path: 'category', component: ProductCategoryComponent},
  {path: 'category/:id/:name', component: ProductCategoryComponent},
  {path: 'subCategory/:id/:name/:id2/:name2', component: ProductSubCategoryComponent},
  {path: 'cartDetails', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent},
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
    CartDetailsComponent,
    CheckoutComponent,  ],
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    }),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
