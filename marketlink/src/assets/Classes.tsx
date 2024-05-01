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
    email: string;
    logoURL: string;
    name: string;
    phoneNumber: string;
    province: string;

    constructor(id: string, email: string, logoURL: string, name: string, phoneNumber: string, province: string) {
        this.id = id;
        this.email = email;
        this.logoURL = logoURL;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.province = province;
    }
}

export class Administrator {
    email: string;
    hashedPassword: string;
    name: string;

    constructor(email: string, hashedPassword: string, name: string) {
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.name = name;
    }
}

export class Cart {
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }
}

export class CartItem {
    cartId: string;
    priceAtAddition: number;
    productId: string;
    quantity: number;

    constructor(cartId: string, priceAtAddition: number, productId: string, quantity: number) {
        this.cartId = cartId;
        this.priceAtAddition = priceAtAddition;
        this.productId = productId;
        this.quantity = quantity;
    }
}

export class PaymentMethod {
    token: string;
    type: string;
    userId: string;

    constructor(token: string, type: string, userId: string) {
        this.token = token;
        this.type = type;
        this.userId = userId;
    }
}

export class Transaction {
    paymentMethodId: string;
    totalPaid: number;
    transactionDate: Date;
    userId: string;

    constructor(paymentMethodId: string, totalPaid: number, transactionDate: Date, userId: string) {
        this.paymentMethodId = paymentMethodId;
        this.totalPaid = totalPaid;
        this.transactionDate = transactionDate;
        this.userId = userId;
    }
}

export class TransactionItem {
    priceAtPurchase: number;
    productId: string;
    quantity: number;
    transactionId: string;

    constructor(priceAtPurchase: number, productId: string, quantity: number, transactionId: string) {
        this.priceAtPurchase = priceAtPurchase;
        this.productId = productId;
        this.quantity = quantity;
        this.transactionId = transactionId;
    }
}
