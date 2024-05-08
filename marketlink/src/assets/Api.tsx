import { setDoc, collection, getDocs, addDoc, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { User, Product, Entrepreneur, Cart, CartItem, CartItemData, Order, EntrepreneurOrder } from './Classes';
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const getUsers = async (): Promise<User[]> => {
    
    const querySnapshot = await getDocs(collection(db, "User"));
    const users = querySnapshot.docs.map(doc => new User(doc.id, doc.data().email, doc.data().name));
    
    return users;
}

export const getProducts = async (): Promise<Product[]> => {
    
    const querySnapshot = await getDocs(collection(db, "Product"));
    const products = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Product(doc.id, data.category, data.description, data.entrepreneur, data.imagesURL, data.name, data.price, data.stock);
    });
    
    return products;
}

export const getEntrepreneurs = async (): Promise<Entrepreneur[]> => {
    
    const querySnapshot = await getDocs(collection(db, "Entrepreneur"));
    const entrepreneurs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Entrepreneur(doc.id, data.description, data.email, data.logoURL, data.name, data.phoneNumber);
    });
    
    return entrepreneurs;
};

export const addEntrepreneur = async (entrepreneur: Entrepreneur): Promise<void> => {
    
    try {
        await setDoc(doc(db, "Entrepreneur", entrepreneur.id), {
            email: entrepreneur.email,
            description: entrepreneur.description,
            logoURL: entrepreneur.logoURL,
            name: entrepreneur.name,
            phoneNumber: entrepreneur.phoneNumber,
            type: "entrepreneur"
        });
        
    } catch (e) {
        
    }
};

export const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        

        const collections = ['User', 'Entrepreneur', 'Administrator'];
        for (const collection of collections) {
            
            const docRef = doc(db, collection, userCredential.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                
                const userData = docSnap.data();
                const userDataWithId = { ...userData, uid: userCredential.user.uid };
                localStorage.setItem('userData', JSON.stringify(userDataWithId));
                return {
                    type: userData.type,
                    route: getRouteForUser(collection)
                };
            }
        }

        
        return { error: "no user data available" };
    } catch (error) {
        
        return { error: "authentication failed. please check your credentials and try again." };
    }
};

const getRouteForUser = (type: string) => {
    
    switch (type) {
        case "Entrepreneur":
            return "/entrepreneur-profile";
        case "User":
            return "/client-profile";
        case "Administrator":
            return "/admin-dashboard";
        default:
            
            return "/login";
    }
};

export const addProduct = async (product: Product): Promise<void> => {
    try {
        const entrepreneurRef = doc(db, "Entrepreneur", product.entrepreneur);
        const productData = {
            ...product,
            entrepreneur: entrepreneurRef
        };

        await addDoc(collection(db, "Product"), productData);
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
            
            return null;
        }

        return new Cart(cartSnapshot.docs[0].id, userId);
    } catch (error) {
        
        throw error; 
    }
}


export const getProduct = async (productId: string): Promise<Product> => {
    const productRef = doc(db, "Product", productId); 
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
        return new Product(productId, "", "", "", [], "", 0, 0); 
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
}

export const getProductString = async (productId: string): Promise<Product> => {
    const productRef = doc(db, "Product", productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
        return new Product("", "", "", "", [], "", 0, 0);
    }
    const productData = productDoc.data();
    return new Product(productId, productData.category, productData.description, productData.entrepreneur, productData.imagesURL, productData.name, productData.price, productData.stock);
}

export const getEntrepreneur = async (entrepreneurId: string): Promise<Entrepreneur> => {
    const entrepreneurRef = doc(db, "Entrepreneur", entrepreneurId); 
    const entrepreneurDoc = await getDoc(entrepreneurRef);
    if (!entrepreneurDoc.exists()) {
        
        return new Entrepreneur(entrepreneurId, "", "", "", "", ""); 
    }
    const entrepreneurData = entrepreneurDoc.data();

    return new Entrepreneur(
        entrepreneurId,
        entrepreneurData.description,
        entrepreneurData.email,
        entrepreneurData.logoURL,
        entrepreneurData.name,
        entrepreneurData.phoneNumber
    );
}


export const getCartItems = async (userId: string): Promise<CartItemData[]> => {
    const cart = await getCart(userId); 
    if (!cart) {
        
        return [];
    }
    const q = query(collection(db, "CartItem"), where("cartId", "==", doc(db, "Cart", cart.id)));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        
        return [];
    }
    const cartItemsDetails: CartItemData[] = [];

    for (const doc of querySnapshot.docs) {

        const cartItem = doc.data() as CartItem; 
        const product = await getProduct(cartItem.productId); 
        const productName = product.name;
        const productUrl = product.imagesURL[0];
        const productID = product.id
        
        const entrepreneur = await getEntrepreneur(product.entrepreneur);
        
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
    
    return cartItemsDetails;
};

export const deleteCartItem = async (cartItemId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "CartItem", cartItemId));
        
    } catch (error) {
        
    }
}

export const getProductsByEntrepreneur = async (entrepreneurId: string): Promise<Product[]> => {
    
    try {
        const productsRef = collection(db, "Product");
        const entrepreneurRef = doc(db, "Entrepreneur", entrepreneurId);
        const q = query(productsRef, where("entrepreneur", "==", entrepreneurRef));
        const querySnapshot = await getDocs(q);
        
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
        
        throw new Error("Unable to fetch products");
    }
};

export const getUser = async (userId: string): Promise<User> => {
    
    const userRef = doc(db, "User", userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        
        return new User("", "", "");
    }
    const userData = userDoc.data();
    return new User(userId, userData.email, userData.name);
};

export const getUserByEmail = async (email: string): Promise<User> => {
    
    const q = query(collection(db, "User"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        
        return new User("", "", "");
    }
    const userData = querySnapshot.docs[0].data();
    return new User(querySnapshot.docs[0].id, userData.email, userData.name);
};

export const getProductById = async (productId: string): Promise<Product | null> => {
    
    const productRef = doc(db, "Product", productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
        
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
    
    const cart = await getCart(userId);

    if (!cart) {
        
        return;
    }

    
    const cartItemsRef = collection(db, "CartItem");
    await addDoc(cartItemsRef, {
        cartId: doc(db, "Cart", cart.id),
        productId: doc(db, "Product", productId),
        priceAtAddition: priceAtAddition,
        quantity: quantity
    });
    
};


export const getEntrepreneurByCartItemId = async (cartItemId: string): Promise<Entrepreneur> => {
    
    const cartItemRef = doc(db, "CartItem", cartItemId);
    const cartItemDoc = await getDoc(cartItemRef);
    if (!cartItemDoc.exists()) {
        
        return new Entrepreneur("", "", "", "", "", "");
    }
    const cartItemData = cartItemDoc.data();
    const product = await getProductById(cartItemData.productId.id);
    if (product) {
        return getEntrepreneur(product.entrepreneur);
    } else {
        
        return new Entrepreneur("", "", "", "", "", "");
    }
};

export const getProductByCartItemId = async (): Promise<Product | null> => {
    const cartItemRef = doc(db, "CartItem");
    const cartItemDoc = await getDoc(cartItemRef);
    if (!cartItemDoc.exists()) {
        
        return null;
    }
    const cartItemData = cartItemDoc.data();
    return getProductById(cartItemData.productId.id);
}

export const checkItemAvailability = async (productId: string, quantity: number): Promise<boolean> => {
    
    const product = await getProductById(productId);
    if (product && product.stock >= quantity) {
        return true;
    } else {
        return false;
    }
};

export const updateProduct = async (productId: string, updatedProductData: Product): Promise<void> => {
    
    const productRef = doc(db, "Product", productId);
    const cleanData: { [key: string]: string | number | string[] | undefined } = {};
    Object.keys(updatedProductData).forEach(key => {
        const value = updatedProductData[key as keyof Product];
        if (value !== undefined) {
            cleanData[key] = value;
        }
    });
    try {
        await updateDoc(productRef, cleanData);
        
    } catch (error) {
        throw new Error("Failed to update product");
    }
};



export const deleteCartItems = async (userId: string): Promise<void> => {
    const cartId = await getCart(userId);
    if (!cartId) {
        
        return;
    }

    const q = query(collection(db, "CartItem"), where("cartId", "==", doc(db, "Cart", cartId.id)));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        
        return;
    }

    const promises = querySnapshot.docs.map((docSnapshot) => {
        return deleteDoc(doc(db, "CartItem", docSnapshot.id));
    });

    try {
        await Promise.all(promises);
        
    } catch (error) {
        
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

        const items = await Promise.all(transactionItemsSnapshot.docs.map(async (itemDoc) => {
            const itemData = itemDoc.data();
            
            const product = await getProduct(itemData.product);
            
            const entrepreneur = await getEntrepreneur(product.entrepreneur);
            return {
                productName: product.name,
                entrepreneurName: entrepreneur.name,
                priceAtPurchase: itemData.priceAtPurchase,
                quantity: itemData.quantity,
                productImage: product.imagesURL[0],
                status: itemData.status
            };
        }));
        return new Order(
            items.map(item => item.productImage).join(", "), 
            items.map(item => item.entrepreneurName).join(", "), 
            items.map(item => item.priceAtPurchase).join(", "), 
            items.map(item => item.productName).join(", "), 
            items.map(item => item.quantity).join(", "),
            items.map(item => item.status).join(", "),
            shippingDetails,
            date, 
            method,
        );
    }));
    return orders;
}
export const updateClientUserName = async (userId: string, updatedUserName: string): Promise<void> => {
    
    const userRef = doc(db, "User", userId);
    try {
        await updateDoc(userRef, {
            name: updatedUserName
          });
    } catch (error) {
        
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

export const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
        await deleteDoc(doc(db, 'Product', productId));
        
        return true; 
    } catch (error) {
        
        return false; 
    }
};