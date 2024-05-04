import { setDoc, collection, getDocs, addDoc, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { User, Product, Entrepreneur, Cart, CartItem, CartItemData, Transaction, TransactionItem } from './Classes'; 
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const getUsers = async (): Promise<User[]> => {
    const querySnapshot = await getDocs(collection(db, "User"));
    return querySnapshot.docs.map(doc => new User(doc.id, doc.data().email, doc.data().name));
}

export const getProducts = async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, "Product"));
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Product(doc.id, data.category, data.description, data.entrepreneur, data.imagesURL, data.name, data.price, data.stock);
    });
}

export const getEntrepreneurs = async (): Promise<Entrepreneur[]> => {
    const querySnapshot = await getDocs(collection(db, "Entrepreneur"));
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Entrepreneur(doc.id, data.description, data.email, data.logoURL, data.name, data.phoneNumber);
    });
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
        console.log("Entrepreneur added to Firestore with ID:", entrepreneur.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};


export const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const collections = ['User', 'Entrepreneur', 'Administrator'];
        for (const collection of collections) {
            const docRef = doc(db, collection, uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const userDataWithId = { ...userData, uid }; 
                localStorage.setItem('userData', JSON.stringify(userDataWithId)); 
                return {
                    type: userData.type,
                    route: getRouteForUser(collection)
                };
            }
        }

        console.log("No user data available in any collection");
        return { error: "No user data available" };
    } catch (error) {
        console.error("Authentication failed:", error);
        return { error: "Authentication failed. Please check your credentials and try again." };
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
            console.error("Unknown user type");
            return "/login";
    }
};

export const addProduct = async (product: Product): Promise<void> => {
    try {
    
        const entrepreneurRef = doc(db, "Entrepreneur", product.entrepreneur);

        const productData = {
            ...product,
            entrepreneur: entrepreneurRef,
            imagesURL: product.imagesURL.join(','),
        };

        const docRef = await addDoc(collection(db, "Product"), productData);
        console.log("Product added successfully with auto-generated ID:", docRef.id);
    } catch (error) {
        console.error("Error adding product:", error);
    }
};

const getCart = async (userId: string): Promise<Cart> => {
    const userRef = doc(db, "User", userId);
    const cartsQuery = query(collection(db, "Cart"), where("user", "==", userRef));
    const cart = await getDocs(cartsQuery);
    return new Cart(cart.docs[0].id, userId);
}

export const getProduct = async (productId: string): Promise<Product> => {
    const productRef = doc(db, "Product", productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
        return new Product("", "", "", "", [], "", 0, 0);
    }
    const productData = productDoc.data();
    return new Product(productId, productData.category, productData.description, productData.entrepreneur, productData.imagesURL, productData.name, productData.price, productData.stock);
}

const getEntrepreneur = async (entrepreneurId: string): Promise<Entrepreneur> => {
    const entrepreneurRef = doc(db, "Entrepreneur", entrepreneurId);
    const entrepreneurDoc = await getDoc(entrepreneurRef);
    if (!entrepreneurDoc.exists()) {
        return new Entrepreneur("", "", "", "", "", "");
    }
    const entrepreneurData = entrepreneurDoc.data();
    return new Entrepreneur(entrepreneurId, entrepreneurData.description, entrepreneurData.email, entrepreneurData.logoURL, entrepreneurData.name, entrepreneurData.phoneNumber);
}

export const getCartItems = async (userId: string): Promise<CartItemData[]> => {
    const cart = await getCart(userId);
    const q = query(collection(db, "CartItem"), where("cartId", "==", doc(db, "Cart", cart.id)));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        console.log("No cart items found");
        return [];
    }

    const cartItemsDetails: CartItemData[] = [];

    for (const doc of querySnapshot.docs) {
        const cartItem = doc.data();
        const product = await getProduct(cartItem.productId.id);
        const productName = product.name;
        const productImage = product.imagesURL[0];
        console.log(product.entrepreneur);
        const entrepreneur = await getEntrepreneur(product.entrepreneur.id);
        console.log(productName)
        cartItemsDetails.push(new CartItemData(
            doc.id,
            productImage,
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
        console.log("Document successfully deleted");
    } catch (error) {
        console.error("Error removing document: ", error);
    }
}

export const getProductsByEntrepreneur = async (entrepreneurId: string): Promise<Product[]> => {
    try {
        const productsRef = collection(db, "Product");
        const entrepreneurRef = doc(db, "Entrepreneur", entrepreneurId);  // Crea la referencia
        const q = query(productsRef, where("entrepreneur", "==", entrepreneurRef));  // Utiliza la referencia en la consulta
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Asigna el entrepreneurId en lugar de la referencia para facilitar su uso en el cliente
            return new Product(
                doc.id,
                data.category,
                data.description,
                entrepreneurId,  // Usa el ID en lugar de la referencia
                data.imagesURL,
                data.name,
                data.price,
                data.stock
            );
        });
        
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
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
}

export const getProductById = async (productId: string): Promise<Product | null> => {
    const productRef = doc(db, "Product", productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
        console.log("No product found with ID:", productId);
        return null;  
    }

    const productData = productDoc.data();
    return new Product(
        productDoc.id,
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
    const product = await getProduct(cartItemData.productId.id);
    return getEntrepreneur(product.entrepreneur.id);
}

export const checkItemAvailability = async (productId: string, quantity: number): Promise<boolean> => {
    const product = await getProductById(productId);
    if (!product) {
        return false;
    }
    return product.stock >= quantity;
}

  export const updateProduct = async (productId: string, updatedProductData: Product): Promise<void> => {
    console.log("Attempting to update product with ID:", productId, "Data:", updatedProductData);
    const productRef = doc(db, "Product", productId);

    // Crear una copia de updatedProductData limpiando valores undefined
    const cleanData: any = {};
    Object.keys(updatedProductData).forEach(key => {
        if (updatedProductData[key] !== undefined) { // Solo añadir propiedades definidas
            cleanData[key] = updatedProductData[key];
        }
    });

    try {
        await updateDoc(productRef, cleanData);
        console.log("Product updated successfully");
    } catch (error) {
        console.error("Failed to update product:", error);
        throw new Error("Failed to update product");
    }
};


export const addTransaction = async (userId: string, cartItems: CartItemData[], total: number, shippingAddress: string, paymentMethod: string): Promise<void> => {
    const userRef = doc(db, "User", userId);
    const transactionRef = collection(db, "Transaction");

    const transactionItems: TransactionItem[] = cartItems.map(cartItem => {
        return {
            productId: doc(db, "Product", cartItem.productId),
            priceAtAddition: cartItem.priceAtAddition,
            quantity: cartItem.quantity
        };
    });

    await addDoc(transactionRef, {
        user: userRef,
        total: total,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        items: transactionItems
    });
}