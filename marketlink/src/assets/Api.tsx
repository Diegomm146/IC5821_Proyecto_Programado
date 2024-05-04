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
        console.log("entrepreneur added to firestore with id:", entrepreneur.id);
    } catch (e) {
        console.error("error adding document: ", e);
    }
};


export const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    try {
        console.log("attempting sign in with email:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("signed in user uid:", userCredential.user.uid);

        const collections = ['User', 'Entrepreneur', 'Administrator'];
        for (const collection of collections) {
            const docRef = doc(db, collection, userCredential.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log(`user data from collection ${collection}:`, userData);
                const userDataWithId = { ...userData, uid: userCredential.user.uid };
                localStorage.setItem('userData', JSON.stringify(userDataWithId));
                return {
                    type: userData.type,
                    route: getRouteForUser(collection)
                };
            }
        }

        console.log("no user data available in any collection");
        return { error: "no user data available" };
    } catch (error) {
        console.error("authentication failed:", error);
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
            console.error("unknown user type");
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
        console.log("Estamos hechos ccacaca ! " + productId);
        return new Product("", "", "", "", [], "", 0, 0);
    }
    const productData = productDoc.data();
    return new Product(productId, productData.category, productData.description, productData.entrepreneur, productData.imagesURL, productData.name, productData.price, productData.stock);
}

const getEntrepreneur = async (entrepreneurId: string): Promise<Entrepreneur> => {
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
    console.log("Cart:", querySnapshot.empty)

    if (querySnapshot.empty) {
        console.log("No cart items found");
        return [];
    }

    const cartItemsDetails: CartItemData[] = [];

    for (const doc of querySnapshot.docs) {
        console.log(doc)

        const cartItem = doc.data() as CartItem; 
        console.log(cartItem.productId.id)
        const product = await getProduct(cartItem.productId.id);
        const productName = product.name;
        const productUrl = product.imagesURL[0];
        const entrepreneur = await getEntrepreneur(product.entrepreneur);
    
        cartItemsDetails.push(new CartItemData(
            doc.id,
            productName,
            productUrl, 
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
        const entrepreneurRef = doc(db, "Entrepreneur", entrepreneurId);  
        const q = query(productsRef, where("entrepreneur", "==", entrepreneurRef));  
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => {
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
    
        const cleanData: { [key: string]: any } = {}; 
        Object.keys(updatedProductData).forEach(key => {
            const value = updatedProductData[key as keyof Product];
            if (value !== undefined) {
                cleanData[key] = value as NonNullable<typeof value>;
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
