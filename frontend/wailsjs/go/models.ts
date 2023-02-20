export namespace manager {
	
	export class Account {
	    address: string;
	    publicKey: string;
	    // Go type: struct { Balance int64 "json:\"balance\""; Precision uint32 "json:\"precision\"" }
	    neofs: any;
	    nep17: {[key: string]: wallet.Nep17Tokens};
	
	    static createFrom(source: any = {}) {
	        return new Account(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = source["address"];
	        this.publicKey = source["publicKey"];
	        this.neofs = this.convertValues(source["neofs"], Object);
	        this.nep17 = this.convertValues(source["nep17"], wallet.Nep17Tokens, true);
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
	export class Element {
	    id: string;
	    size: number;
	    attributes: {[key: string]: string};
	    errors: any[];
	    children: Element[];
	
	    static createFrom(source: any = {}) {
	        return new Element(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.size = source["size"];
	        this.attributes = source["attributes"];
	        this.errors = source["errors"];
	        this.children = this.convertValues(source["children"], Element);
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
	
	
	
	export class contact {
	    firstName: string;
	    lastName: string;
	    walletAddress: string;
	    publicKey: string;
	
	    static createFrom(source: any = {}) {
	        return new contact(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.firstName = source["firstName"];
	        this.lastName = source["lastName"];
	        this.walletAddress = source["walletAddress"];
	        this.publicKey = source["publicKey"];
	    }
	}

}

export namespace wallet {
	
	export class Token {
	    name: string;
	    script_hash: number[];
	    decimals: number;
	    symbol: string;
	    standard: string;
	
	    static createFrom(source: any = {}) {
	        return new Token(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.script_hash = source["script_hash"];
	        this.decimals = source["decimals"];
	        this.symbol = source["symbol"];
	        this.standard = source["standard"];
	    }
	}
	export class Nep17Tokens {
	    asset: number[];
	    amount: number;
	    symbol: string;
	    meta: Token;
	    error: any;
	
	    static createFrom(source: any = {}) {
	        return new Nep17Tokens(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.asset = source["asset"];
	        this.amount = source["amount"];
	        this.symbol = source["symbol"];
	        this.meta = this.convertValues(source["meta"], Token);
	        this.error = source["error"];
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

}

