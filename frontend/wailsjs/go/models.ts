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
export class Container {


    static createFrom(source: any = {}) {
        return new Container(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}
export class Balance {


    static createFrom(source: any = {}) {
        return new Balance(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}
export class ObjectHeadRes {


    static createFrom(source: any = {}) {
        return new ObjectHeadRes(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}
export class Element {
    id: string;
    type: string;
    name: string;
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
        this.type = source["type"];
        this.name = source["name"];
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
