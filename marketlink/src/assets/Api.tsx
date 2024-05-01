import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { User, Product, Entrepreneur } from './Classes'; // Adjust the import path to where the classes are defined

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
        const docRef = await addDoc(collection(db, "Entrepreneur"), {
            id: entrepreneur.id,
            email: entrepreneur.email,
            logoURL: entrepreneur.logoURL,
            name: entrepreneur.name,
            phoneNumber: entrepreneur.phoneNumber,
            province: entrepreneur.province
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};