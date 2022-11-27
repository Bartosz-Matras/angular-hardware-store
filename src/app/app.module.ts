import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { RouterModule, Routes } from '@angular/router';
import { ProductSubCategoryComponent } from './components/product-sub-category/product-sub-category.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {path: 'category', component: ProductCategoryComponent},
  {path: 'category/:id/:name', component: ProductCategoryComponent},
  {path: 'subCategory/:id/:name', component: ProductSubCategoryComponent},
  {path: 'search/:keyword', component: ProductCategoryComponent},
  {path: '', redirectTo: '/category', pathMatch: 'full'},
  {path: '**', redirectTo: '/category', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    ProductCategoryComponent,
    ProductSubCategoryComponent,
    SearchComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
