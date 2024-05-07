import { FunctionComponent, useState } from "react";
import styles from "./RegisterClient.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { db, auth } from "../../src/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const RegisterClient: FunctionComponent = () => {
  const [userName, setUserName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting form with data:", { userName, email, password });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase Auth User Created:", user);

      await setDoc(doc(db, "User", user.uid), {
        name: userName,
        email: email,
        type: "client"
      });
      console.log("Firestore document set for user:", user.uid);

      await addDoc(collection(db, "Cart"), {
        user: doc(db, "User", user.uid)
      });
      toast.success("User registered successfully!");
      window.location.href = "/login";
    } catch (error:any) {
      let errorMessage = "";


      switch (error.code) {
        case "auth/weak-password":
          errorMessage = "The password is too weak. Please choose a stronger password.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with the provided email address already exists.";
          break;
        case "auth/invalid-email":
          errorMessage = "The provided email address is not valid. Please enter a valid email address.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.";
          break;
        default:
          errorMessage = "An error occurred during registration. Please try again later.";
      }
      toast.error(errorMessage);

      setError(errorMessage);
    }
  };
  const Login = async () => {
    navigate('/login');
  };

  return (
  <div className={styles.loginContainerRegisterClient}>
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col">
          <div className={`${styles.rowsRegisterClient} row`} style={{height: "25%"}}>
            <img src="../../image.png" alt="logo" style={{ maxWidth: "200px", maxHeight: "250px", paddingTop: "100px"}} />
          </div>
          <div className={`${styles.rowsRegisterClient} row`} style={{height: "15%"}}>
            <h1 className={styles.iniciarSesionRegisterClient}>Register</h1>
          </div>
            <div className={`${styles.rowsRegisterClient} row`} style={{height: "30%"}}>
              <form className={styles.formContainerRegisterClient} method="post" onSubmit={handleSubmit}>
                  <input 
                    type="text" className={`${styles.inputsRegisterClient}`} placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input 
                    type="text" className={`${styles.inputsRegisterClient}`} placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <input 
                    type="text"  className={`${styles.inputsRegisterClient}`} placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="submit" value="Submit" className={`${styles.botonTransparenteRegisterClient}`} style={{ width: "15%", marginBottom:"15px" }}>Accept</button>
                    {error && (
                      <div className="alert alert-danger alert-dismissible">
                        <button type="button" className="close" onClick={() => setError("")}><img src="../../delete.png" width={20}/></button>
                        <strong>Error!</strong> {error}
                      </div>
                  )}
                  <button className={`${styles.botonTransparenteRegisterClient}`} style={{ width: "15%", marginBottom:"15px" }} onClick={Login}>Login</button>
              </form>
            </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default RegisterClient;
