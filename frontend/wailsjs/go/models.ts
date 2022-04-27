/* Do not change, this code is generated from Golang structs */

export {};

export class Client {


    static createFrom(source: any = {}) {
        return new Client(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}
export class Element {


    static createFrom(source: any = {}) {
        return new Element(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}

export class Nep17Tokens {


    static createFrom(source: any = {}) {
        return new Nep17Tokens(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}
export class  {
    balance: number;
    precision: number;

    static createFrom(source: any = {}) {
        return new (source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.balance = source["balance"];
        this.precision = source["precision"];
    }
}
export class Account {
    address: string;
    neofs: ;
    nep17: {[key: string]: Nep17Tokens};

    static createFrom(source: any = {}) {
        return new Account(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.address = source["address"];
        this.neofs = this.convertValues(source["neofs"], );
        this.nep17 = this.convertValues(source["nep17"], Nep17Tokens, true);
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class Object {


    static createFrom(source: any = {}) {
        return new Object(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}


export class UXMessage {


    static createFrom(source: any = {}) {
        return new UXMessage(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}


export class ProgressMessage {


    static createFrom(source: any = {}) {
        return new ProgressMessage(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}

