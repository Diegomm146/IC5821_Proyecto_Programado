import { setDoc, collection, getDocs } from 'firebase/firestore';
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

        console.log(uid);

        const collections = ['User', 'Entrepreneur', 'Administrator'];

       for (const collection of collections) {
            const docRef = doc(db, collection, uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log(`${collection} login detected:`, userData);
                return redirectUserBasedOnType(userData.type);
            }
        }

        console.log("No user data available in any collection");
        return { error: "No user data available" };
    } catch (error) {
        console.error("Authentication failed:", error);
        return { error: "Authentication failed. Please check your credentials and try again." };
    }
};

const redirectUserBasedOnType = (type: string) => {
    switch (type) {
        case "entrepreneur":
            console.log("entrepreneur");
            //window.location.href = "/entrepreneur-dashboard";
            break;
        case "user":
            console.log("user");
            //window.location.href = "/user-dashboard";
            break;
        case "administrator":
            console.log("administrator");
            //window.location.href = "/admin-dashboard";
            break;
        default:
            console.log("Unknown user type");
            return { error: "User type is unknown, contact support." };
    }
};
