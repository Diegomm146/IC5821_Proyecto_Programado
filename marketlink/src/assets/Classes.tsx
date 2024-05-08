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
    entrepreneur: string;
    imagesURL: string[];  
    name: string;
    price: number;
    stock: number;

    constructor(
        id: string, 
        category: string, 
        description: string, 
        entrepreneur: string, 
        imagesURL: string[],  
        name: string, 
        price: number, 
        stock: number
    ) {
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
    description: string;
    email: string;
    logoURL: string;
    name: string;
    phoneNumber: string;

    constructor(id: string, description: string ,email: string, logoURL: string, name: string, phoneNumber: string) {
        this.id = id;
        this.description = description;
        this.email = email;
        this.logoURL = logoURL;
        this.name = name;
        this.phoneNumber = phoneNumber;
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
    id: string;
    userId: string;

    constructor(id: string, userId: string) {
        this.userId = userId;
        this.id = id;
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


export class CartItemData {
    id: string;
    productId: string;            
    productName: string;   
    productImage: string; 
    entrepreneurName: string; 
    price: number;         
    quantity: number;       

    constructor(id: string, productId: string ,productImage: string, productName: string, entrepreneurName: string, price: number, quantity: number) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.entrepreneurName = entrepreneurName;
        this.price = price;
        this.quantity = quantity;
    }
}


export class Order {
    productImage: string;
    entrepreneurName: string;
    productName: string;
    quantity: string;
    status: string;
    amoutPaid: string;
    shippingDetails: string;
    dateCompleted: Date;
    paymentMethod: string;

    constructor(productImage: string, entrepreneurName: string, amoutPaid: string ,productName: string, quantity: string,  status: string, shippingDetails: string, dateCompleted: Date, paymentMethod: string) {
        this.productImage = productImage;
        this.entrepreneurName = entrepreneurName;
        this.productName = productName;
        this.quantity = quantity;
        this.status = status;
        this.amoutPaid = amoutPaid;
        this.shippingDetails = shippingDetails;
        this.dateCompleted = dateCompleted;
        this.paymentMethod = paymentMethod;
    }
}

export class EntrepreneurOrder {
    transactionItemId: string;
    clientEmail: string;
    date: Date;
    amount: number;
    product: string;
    shippingSpecs: string;
    status: string;

    constructor(transactionItemId: string, clientEmail: string, date: Date, amount: number, product: string, shippingSpecs: string, status: string) {
        this.transactionItemId = transactionItemId;
        this.clientEmail = clientEmail;
        this.date = date;
        this.amount = amount;
        this.product = product;
        this.shippingSpecs = shippingSpecs;
        this.status = status;
    }
}
