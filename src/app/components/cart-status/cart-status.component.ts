import { Component, OnInit } from '@angular/core';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  wholePrice: number = 0.00;
  wholeQuantity: number = 0;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.cartService.wholeQuantity.subscribe(
      data => this.wholeQuantity = data
    );
  }

}
