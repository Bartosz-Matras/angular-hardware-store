import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CartFormService } from 'src/app/services/cart-form.service';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  wholePrice: number = 0;
  shippingPrice: string = "";

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private cartService: CartServiceService,
              private router: Router,
              private cartFormService: CartFormService) { }

  ngOnInit(): void {
    if(this.cartService.cartProducts.length === 0){
      this.router.navigateByUrl(`/cartDetails`);
    }

    this.cartService.computeWholePriceAndQuantity();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        zipCode: [''],
        state: [''],
        country: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        zipCode: [''],
        state: [''],
        country: ['']
      }),
      creaditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });


    this.cartService.sendWholePrice.subscribe(
      data => {
        this.wholePrice = data;
        console.log(this.wholePrice);
      }
    );

    this.cartService.sendShippingCost.subscribe(
      data => {
        this.shippingPrice = data;
        console.log(this.shippingPrice)
      }
    );

    const startMonth: number = new Date().getMonth() + 1;
    this.cartFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    this.cartFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );
  }

  onSubmit() {
    console.log("handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value)
  }

  copyShippingAddress(event: { target: { checked: any; }; }) {

    if(event.target.checked)  {
      this.checkoutFormGroup.controls["billingAddress"]
          .setValue(this.checkoutFormGroup.controls["shippingAddress"].value);
    }else {
      this.checkoutFormGroup.controls["billingAddress"].reset();
    }
  }

}
