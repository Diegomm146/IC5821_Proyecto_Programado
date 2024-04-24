// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
apiKey: "AIzaSyD4tPERKEKE-M4J2o3_speCJHZaT3S3ADY",
authDomain: "marketlink-46ead.firebaseapp.com",
projectId: "marketlink-46ead",
storageBucket: "marketlink-46ead.appspot.com",
messagingSenderId: "841542913457",
appId: "1:841542913457:web:4556a3fb249ac877528190",
measurementId: "G-QGMK19K8LS"
};

const app = initializeApp(firebaseConfig);
console.log('Firebase App initialized:', app);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };