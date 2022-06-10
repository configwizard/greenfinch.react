export namespace manager {
	
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
	    publicKey: string;
	    // Go type: struct { Balance int64 "json:\"balance\""; Precision uint32 "json:\"precision\"" }
	    neofs: any;
	    nep17: {[key: string]: Nep17Tokens};
	
	    static createFrom(source: any = {}) {
	        return new Account(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = source["address"];
	        this.publicKey = source["publicKey"];
	        this.neofs = this.convertValues(source["neofs"], null);
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
	

}

export namespace filesystem {
	
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

}

