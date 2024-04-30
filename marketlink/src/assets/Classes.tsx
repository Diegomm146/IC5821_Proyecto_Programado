export class User {
    id: string;
    email: string;
    name: string;

    constructor(id: string, email: string, name: string) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
}

export class Product {
    id: string;
    category: string;
    description: string;
    entrepreneur: string; // If entrepreneur should be a complex object, define its type or interface
    imagesURL: string;
    name: string;
    price: number;
    stock: number;

    constructor(id: string, category: string, description: string, entrepreneur: string, imagesURL: string, name: string, price: number, stock: number) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.entrepreneur = entrepreneur;
        this.imagesURL = imagesURL;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

export class Entrepreneur {
    id: string;
    canton: string;
    description: string;
    district: string;
    email: string;
    logoURL: string;
    name: string;
    phoneNumber: string;
    province: string;

    constructor(id: string, canton: string, description: string, district: string, email: string, logoURL: string, name: string, phoneNumber: string, province: string) {
        this.id = id;
        this.canton = canton;
        this.description = description;
        this.district = district;
        this.email = email;
        this.logoURL = logoURL;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.province = province;
    }
}
