export class ProductAlsoWatched {

    constructor(public id: number,
                public idFatherProduct: number,
                public idProduct: number,
                public watched_count: number) {

    }
}
