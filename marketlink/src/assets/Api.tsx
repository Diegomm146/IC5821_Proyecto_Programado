import { setDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { User, Product, Entrepreneur } from './Classes'; 
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
                    route: getRouteForUser(userData.type)
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
        case "entrepreneur":
            return "/entrepreneur-profile";
        case "user":
            return "/user-dashboard";
        case "administrator":
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