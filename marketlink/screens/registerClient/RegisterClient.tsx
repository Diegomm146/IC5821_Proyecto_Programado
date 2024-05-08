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
    // Check if all fields are filled and validate them
    if (!userName || !email || !password) {
      toast.error("All fields are required.");
      setError("All fields are required.");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      setError("Invalid email format.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setError("Password too short.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "User", user.uid), {
        name: userName,
        email: email,
        type: "client"
      });

      await addDoc(collection(db, "Cart"), {
        user: doc(db, "User", user.uid)
      });
      toast.success("User registered successfully!");
      navigate("/login");
    } catch (error:any) {
      let errorMessage = error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.loginContainerRegisterClient}>
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col">
            <div className={`${styles.rowsRegisterClient} row`} style={{height: "25%"}}>
              <button onClick={() => navigate('/')} style={{ all: 'unset', cursor: 'pointer' }}>
                <img src="../../image.png" alt="home logo" style={{ maxWidth: "200px", maxHeight: "250px", paddingTop: "100px" }} />
              </button>
            </div>
            <div className={`${styles.rowsRegisterClient} row`} style={{height: "15%"}}>
              <h1 className={styles.iniciarSesionRegisterClient}>Register</h1>
            </div>
            <div className={`${styles.rowsRegisterClient} row`} style={{height: "30%"}}>
              <form className={styles.formContainerRegisterClient} onSubmit={handleSubmit}>
                  <input 
                    type="email" className={styles.inputsRegisterClient} placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input 
                    type="text" className={styles.inputsRegisterClient} placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <input 
                    type="password" className={styles.inputsRegisterClient} placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="submit" className={styles.botonTransparenteRegisterClient} style={{ width: "15%", marginBottom:"15px" }}>Accept</button>
                  {error && (
                    <div className="alert alert-danger alert-dismissible">
                      <button type="button" className="close" onClick={() => setError("")}><span aria-hidden="true">&times;</span></button>
                      <strong>Error!</strong> {error}
                    </div>
                  )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
