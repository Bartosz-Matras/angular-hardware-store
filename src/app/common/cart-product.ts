import { Product } from "./product";

export class CartProduct {

    id: number;
    sku: string;
    name: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.sku = product.sku;

        this.quantity = 1;
    }

}
