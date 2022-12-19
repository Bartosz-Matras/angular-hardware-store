import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartFormService } from 'src/app/services/cart-form.service';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutValidators } from 'src/app/validators/checkout-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  wholePrice: number = 0;
  wholeQuantity: number = 0;
  shippingPrice: string = "";

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private cartService: CartServiceService,
              private router: Router,
              private cartFormService: CartFormService,
              private checkoutService: CheckoutService) { }

  ngOnInit(): void {
    if(this.cartService.cartProducts.length === 0){
      this.router.navigateByUrl(`/cartDetails`);
    }

    this.cartService.computeWholePriceAndQuantity();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });


    this.cartService.sendWholePrice.subscribe(
      data => this.wholePrice = data
    );

    this.cartService.sendShippingCost.subscribe(
      data => this.shippingPrice = data
    );

    this.cartService.sendWholeQuantity.subscribe(
      data => this.wholeQuantity = data
    );

    const startMonth: number = new Date().getMonth() + 1;
    this.cartFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    this.cartFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

    this.cartFormService.getCountries().subscribe(
      data => this.countries = data
    )
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName') }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName') }
  get email() { return this.checkoutFormGroup.get('customer.email') }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
 

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order(this.wholeQuantity, this.wholePrice);

    const cartProducts = this.cartService.cartProducts;

    let orderItems: OrderItem[] = cartProducts.map(tempCartProduct => new OrderItem(tempCartProduct));

    const customer = this.checkoutFormGroup.controls['customer'].value;

    const shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(shippingAddress.state));
    const shippingCountry: State = JSON.parse(JSON.stringify(shippingAddress.country));
    shippingAddress.state = shippingState.name;
    shippingAddress.country = shippingCountry.name;

    const billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(billingAddress.state));
    const billingCountry: State = JSON.parse(JSON.stringify(billingAddress.country));
    billingAddress.state = billingState.name;
    billingAddress.country = billingCountry.name;


    let purchase = new Purchase(customer, shippingAddress, billingAddress, order,  orderItems);

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Zamowienie zostało złożone.\nTwój numer zamówienia: ${response.orderTrackingNumber}`);

        this.resetCart();
      },
      error: err => {
        alert(`Nie udało się złożyć zamówienia: ${err.message}`)
      }
    });

  }

  resetCart() {
    this.cartService.cartProducts = [];
    this.cartService.wholePrice.next(0);
    this.cartService.wholeQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/category");
  }
 
  copyShippingAddress(event: { target: { checked: any; }; }) {

    if(event.target.checked)  {
      this.checkoutFormGroup.controls["billingAddress"]
          .setValue(this.checkoutFormGroup.controls["shippingAddress"].value);

      this.billingAddressStates = this.shippingAddressStates;
    }else {
      this.checkoutFormGroup.controls["billingAddress"].reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(this.checkoutFormGroup.get('creditCard')!.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.cartFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

  getStates(formGropName: string) {
    const formGrop = this.checkoutFormGroup.get(formGropName);
    const countryCode = formGrop?.value.country.code;

    this.cartFormService.getStates(countryCode).subscribe(
      data => {
        if(formGropName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }else {
          this.billingAddressStates = data;
        }

        formGrop?.get('state')?.setValue(data[0]);
      }
    );
  }

}
