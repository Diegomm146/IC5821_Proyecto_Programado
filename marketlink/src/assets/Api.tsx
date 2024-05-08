import { setDoc, collection, getDocs, addDoc, query, where, deleteDoc, updateDoc, DocumentReference } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { User, Product, Entrepreneur, Cart, CartItem, CartItemData, Transaction, TransactionItem, Order, EntrepreneurOrder } from './Classes'; 
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

export const getUsers = async (): Promise<User[]> => {
    console.log("Fetching all users from Firestore");
    const querySnapshot = await getDocs(collection(db, "User"));
    const users = querySnapshot.docs.map(doc => new User(doc.id, doc.data().email, doc.data().name));
    console.log("Fetched users:", users);
    return users;
}

export const getProducts = async (): Promise<Product[]> => {
    console.log("Fetching all products from Firestore");
    const querySnapshot = await getDocs(collection(db, "Product"));
    const products = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Product(doc.id, data.category, data.description, data.entrepreneur, data.imagesURL, data.name, data.price, data.stock);
    });
    console.log("Fetched products:", products);
    return products;
}

export const getEntrepreneurs = async (): Promise<Entrepreneur[]> => {
    console.log("Fetching all entrepreneurs from Firestore");
    const querySnapshot = await getDocs(collection(db, "Entrepreneur"));
    const entrepreneurs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Entrepreneur(doc.id, data.description, data.email, data.logoURL, data.name, data.phoneNumber);
    });
    console.log("Fetched entrepreneurs:", entrepreneurs);
    return entrepreneurs;
};

export const addEntrepreneur = async (entrepreneur: Entrepreneur): Promise<void> => {
    console.log("Adding entrepreneur to Firestore:", entrepreneur);
    try {
        await setDoc(doc(db, "Entrepreneur", entrepreneur.id), {
            email: entrepreneur.email,
            description: entrepreneur.description,
            logoURL: entrepreneur.logoURL,
            name: entrepreneur.name,
            phoneNumber: entrepreneur.phoneNumber,
            type: "entrepreneur"
        });
        console.log("Entrepreneur added to firestore with ID:", entrepreneur.id);
    } catch (e) {
        console.error("Error adding entrepreneur:", e);
    }
};

export const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    console.log("Attempting sign-in with email:", email);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Signed in user UID:", userCredential.user.uid);

        const collections = ['User', 'Entrepreneur', 'Administrator'];
        for (const collection of collections) {
            console.log("Checking user data in collection:", collection);
            const docRef = doc(db, collection, userCredential.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log(`Found user data in collection ${collection}`);
                const userData = docSnap.data();
                const userDataWithId = { ...userData, uid: userCredential.user.uid };
                localStorage.setItem('userData', JSON.stringify(userDataWithId));
                return {
                    type: userData.type,
                    route: getRouteForUser(collection)
                };
            }
        }

        console.log("No user data available in any collection");
        return { error: "no user data available" };
    } catch (error) {
        console.error("Authentication failed:", error);
        return { error: "authentication failed. please check your credentials and try again." };
    }
};

const getRouteForUser = (type: string) => {
    console.log("Determining route for user type:", type);
    switch (type) {
        case "Entrepreneur":
            return "/entrepreneur-profile";
        case "User":
            return "/client-profile";
        case "Administrator":
            return "/admin-dashboard";
        default:
            console.error("Unknown user type:", type);
            return "/login";
    }
};


export const addProduct = async (product: Product): Promise<void> => {
    try {
        const entrepreneurRef = doc(db, "Entrepreneur", product.entrepreneur);

        // Mantén imagesURL como un array en lugar de convertirlo a string
        const productData = {
            ...product,
            entrepreneur: entrepreneurRef
        };

        const docRef = await addDoc(collection(db, "Product"), productData);
        console.log("Product added successfully with auto-generated ID:", docRef.id);
    } catch (error) {
        console.error("Error adding product:", error);
    }
};


const getCart = async (userId: string): Promise<Cart | null> => {
    try {
        const userRef = doc(db, "User", userId);
        const cartsQuery = query(collection(db, "Cart"), where("user", "==", userRef));
        const cartSnapshot = await getDocs(cartsQuery);
        
        if (cartSnapshot.empty) {
            console.log("No cart found for the user: " + userId);
            return null;
        }

        return new Cart(cartSnapshot.docs[0].id, userId);
    } catch (error) {
        console.error("Failed to fetch cart for user " + userId + ":", error);
        throw error; 
    }
}


export const getProduct = async (productId: string): Promise<Product> => {
    const productRef = doc(db, "Product", productId.id);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
        return new Product("", "", "", "", [], "", 0, 0);
    }
    const productData = productDoc.data();
    return new Product(productId, productData.category, productData.description, productData.entrepreneur, productData.imagesURL, productData.name, productData.price, productData.stock);
}

export const getEntrepreneur = async (entrepreneurId: string): Promise<Entrepreneur> => {
    const entrepreneurRef = doc(db, "Entrepreneur", entrepreneurId.id);
    const entrepreneurDoc = await getDoc(entrepreneurRef);
    if (!entrepreneurDoc.exists()) {
        return new Entrepreneur("", "", "", "", "", "");
    }
    const entrepreneurData = entrepreneurDoc.data();
    return new Entrepreneur(entrepreneurId, entrepreneurData.description, entrepreneurData.email, entrepreneurData.logoURL, entrepreneurData.name, entrepreneurData.phoneNumber);
}


export const getCartItems = async (userId: string): Promise<CartItemData[]> => {
    const cart = await getCart(userId); 
    if (!cart) {
        console.log("No cart found for the user");
        return [];
    }
    const q = query(collection(db, "CartItem"), where("cartId", "==", doc(db, "Cart", cart.id)));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log("No cart items found");
        return [];
    }
    const cartItemsDetails: CartItemData[] = [];

    for (const doc of querySnapshot.docs) {

        const cartItem = doc.data() as CartItem; 
        const product = await getProduct(cartItem.productId); 
        const productName = product.name;
        const productUrl = product.imagesURL[0];
        const productID = product.id
        console.log(cartItem);
        const entrepreneur = await getEntrepreneur(product.entrepreneur);
        console.log(entrepreneur);
        cartItemsDetails.push(new CartItemData(
            doc.id,
            productID,
            productUrl, 
            productName,
            entrepreneur.name,  
            cartItem.priceAtAddition,
            cartItem.quantity
        ));
    }
    console.log(cartItemsDetails);
    return cartItemsDetails;
};

export const deleteCartItem = async (cartItemId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "CartItem", cartItemId));
        console.log("Document successfully deleted");
    } catch (error) {
        console.error("Error removing document: ", error);
    }
}

export const getProductsByEntrepreneur = async (entrepreneurId: string): Promise<Product[]> => {
    console.log("Fetching products by entrepreneur ID:", entrepreneurId);
    try {
        const productsRef = collection(db, "Product");
        const entrepreneurRef = doc(db, "Entrepreneur", entrepreneurId);
        const q = query(productsRef, where("entrepreneur", "==", entrepreneurRef));
        const querySnapshot = await getDocs(q);
        console.log("Products fetched for entrepreneur ID:", entrepreneurId);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return new Product(
                doc.id,
                data.category,
                data.description,
                entrepreneurId,
                data.imagesURL,
                data.name,
                data.price,
                data.stock
            );
        });
    } catch (error) {
        console.error("Error fetching products by entrepreneur:", error);
        throw new Error("Unable to fetch products");
    }
};

export const getUser = async (userId: string): Promise<User> => {
    console.log("Fetching user by ID:", userId);
    const userRef = doc(db, "User", userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        console.log("No user found with ID:", userId);
        return new User("", "", "");
    }
    const userData = userDoc.data();
    return new User(userId, userData.email, userData.name);
};

export const getUserByEmail = async (email: string): Promise<User> => {
    console.log("Fetching user by email:", email);
    const q = query(collection(db, "User"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        console.log("No user found with email:", email);
        return new User("", "", "");
    }
    const userData = querySnapshot.docs[0].data();
    return new User(querySnapshot.docs[0].id, userData.email, userData.name);
};

export const getProductById = async (productId: string): Promise<Product | null> => {
    console.log("Fetching product by ID:", productId);
    const productRef = doc(db, "Product", productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
        console.log("No product found with ID:", productId);
        return null;
    }
    const productData = productDoc.data();
    return new Product(
        productId,
        productData.category,
        productData.description,
        productData.entrepreneur,
        productData.imagesURL,
        productData.name,
        productData.price,
        productData.stock
    );
};

export const addCartItem = async (userId: string, priceAtAddition: number, productId: string, quantity: number): Promise<void> => {
    console.log("Adding cart item for user ID:", userId);
    const cart = await getCart(userId);

    if (!cart) {
        console.log("No cart found for user ID:", userId);
        return;
    }

    console.log("Cart found with ID:", cart.id);
    const cartItemsRef = collection(db, "CartItem");
    await addDoc(cartItemsRef, {
        cartId: doc(db, "Cart", cart.id),
        productId: doc(db, "Product", productId),
        priceAtAddition: priceAtAddition,
        quantity: quantity
    });
    console.log("Cart item added successfully for product ID:", productId);
};


export const getEntrepreneurByCartItemId = async (cartItemId: string): Promise<Entrepreneur> => {
    console.log("Fetching entrepreneur for cart item ID:", cartItemId);
    const cartItemRef = doc(db, "CartItem", cartItemId);
    const cartItemDoc = await getDoc(cartItemRef);
    if (!cartItemDoc.exists()) {
        console.log("No cart item found with ID:", cartItemId);
        return new Entrepreneur("", "", "", "", "", "");
    }
    const cartItemData = cartItemDoc.data();
    const product = await getProductById(cartItemData.productId.id);
    if (product) {
        return getEntrepreneur(product.entrepreneur);
    } else {
        console.log("No product associated with cart item ID:", cartItemId);
        return new Entrepreneur("", "", "", "", "", "");
    }
};

export const getProductByCartItemId = async (cartItemId: string): Promise<Product | null> => {
    const cartItemRef = doc(db, "CartItem");
    const cartItemDoc = await getDoc(cartItemRef);
    if (!cartItemDoc.exists()) {
        console.log("No cart item found with ID:", cartItemId);
        return null;
    }
    const cartItemData = cartItemDoc.data();
    return getProductById(cartItemData.productId.id);
}

export const checkItemAvailability = async (productId: string, quantity: number): Promise<boolean> => {
    console.log("Checking availability for product ID:", productId, "Quantity:", quantity);

    const product = await getProductById(productId.id);
    if (product && product.stock >= quantity) {
        console.log("Product is available:", productId);
        return true;
    } else {
        console.log("Product is not available:", productId);
        return false;
    }
};

export const updateProduct = async (productId: string, updatedProductData: Product): Promise<void> => {
    console.log("Attempting to update product with ID:", productId, "Data:", updatedProductData);
    const productRef = doc(db, "Product", productId);
    const cleanData: { [key: string]: string | number | undefined } = {}; 
    Object.keys(updatedProductData).forEach(key => {
        const value = updatedProductData[key];
        if (value !== undefined) {
            cleanData[key] = value;
        }
    });
    try {
        await updateDoc(productRef, cleanData);
        console.log("Product updated successfully with ID:", productId);
    } catch (error) {
        console.error("Failed to update product with ID:", productId, "Error:", error);
        throw new Error("Failed to update product");
    }
};



export const deleteCartItems = async (userId: string): Promise<void> => {
    const cartId = await getCart(userId);
    if (!cartId) {
        console.log("No cart found for user ID:", userId);
        return;
    }

    const q = query(collection(db, "CartItem"), where("cartId", "==", doc(db, "Cart", cartId.id)));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
    }

    const promises = querySnapshot.docs.map((docSnapshot) => {
        return deleteDoc(doc(db, "CartItem", docSnapshot.id));
    });

    try {
        await Promise.all(promises);
        console.log("All items deleted successfully.");
    } catch (error) {
        console.error("Error deleting items: ", error);
    }
};

export const getOrders = async (userId: string): Promise<Order[]> => {
    const transactionsQuery = query(collection(db, "Transaction"), where("user", "==", doc(db, "User", userId)));
    const transactionsSnapshot = await getDocs(transactionsQuery);

    const orders = await Promise.all(transactionsSnapshot.docs.map(async (transactionDoc) => {
        const transactionData = transactionDoc.data();
        const transactionItemsQuery = query(collection(db, "TransactionItem"), where("transaction", "==", doc(db, "Transaction", transactionDoc.id)));
        const transactionItemsSnapshot = await getDocs(transactionItemsQuery);
        const shippingDetails = transactionData.shippingDetails;
        const date = transactionData.transactionDate;
        const method = transactionData.paymentMethod;
        console.log(shippingDetails, date, method)
        const items = await Promise.all(transactionItemsSnapshot.docs.map(async (itemDoc) => {
            const itemData = itemDoc.data();
            console.log(itemData.product.id)
            const product = await getProduct(itemData.product);
            console.log(product)
            const entrepreneur = await getEntrepreneur(product.entrepreneur);
            return {
                productName: product.name,
                entrepreneurName: entrepreneur.name,
                priceAtPurchase: itemData.priceAtPurchase,
                quantity: itemData.quantity,
                productImage: product.imagesURL[0] 
            };
        }));
        return new Order(
            items.map(item => item.productImage).join(", "), 
            items.map(item => item.entrepreneurName).join(", "), 
            items.map(item => item.priceAtPurchase).join(", "), 
            items.map(item => item.productName).join(", "), 
            items.map(item => item.quantity).join(", "),
            shippingDetails,
            date, 
            method
        );
    }));
    return orders;
}
export const updateClientUserName = async (userId: string, updatedUserName: string): Promise<void> => {
    console.log("Attempting to update user with ID:", userId, "Data:", updatedUserName);
    const userRef = doc(db, "User", userId);
    try {
        await updateDoc(userRef, {
            name: updatedUserName
          });
    } catch (error) {
        console.error("Failed to update user with ID:", userId, "Error:", error);
        throw new Error("Failed to update user");
    }
}


export const getEntrepreneurOrders = async (entrepreneurId: string): Promise<EntrepreneurOrder[]> => {
    const productRef = query(collection(db, "Product"), where("entrepreneur", "==", doc(db, "Entrepreneur", entrepreneurId)));
    const productSnapshot = await getDocs(productRef);
    const orders = [];

    for (const product of productSnapshot.docs) {
        const transactionItemRef = query(collection(db, "TransactionItem"), where("product", "==", doc(db, "Product", product.id)));
        const transactionItemSnapshot = await getDocs(transactionItemRef);

        for (const itemDoc of transactionItemSnapshot.docs) {
            const itemDocData = itemDoc.data();
            const transactionRef = doc(db, "Transaction", itemDocData.transaction.id);
            const transactionDoc = await getDoc(transactionRef);
            if (!transactionDoc.exists()) continue;
            const transactionData = transactionDoc.data();

            const userRef = doc(db, "User", transactionData.user.id);
            const userDoc = await getDoc(userRef);
            const clientEmail = userDoc.exists() ? userDoc.data().email : "No email found";

            orders.push(new EntrepreneurOrder(
                itemDoc.id,
                clientEmail,
                transactionData.transactionDate, 
                itemDocData.quantity,
                product.data().name,
                transactionData.shippingDetails,
                itemDocData.status 
            ));
        }
    }

    return orders;
}

export const updateEntrepreneurOrderStatus = async (orderId: string, newStatus: string): Promise<void> => {
    try {
        await updateDoc(doc(db, "TransactionItem", orderId), {
            status: newStatus
        });
    } catch (error) {
        throw new Error("Failed to update order status");
    }
}