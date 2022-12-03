export class ProductAlsoBought {

    constructor(public id: number,
                public idFatherProduct: number,
                public idProduct: number,
                public boughtCount: number) {

    }
}
