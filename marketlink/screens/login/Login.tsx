import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Login.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { initializeAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../src/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const Login: FunctionComponent = () => {
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[isSignedIn, setIsSignedIn] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log("Submitting form with data:", { email, password, isSignedIn });
      setIsSignedIn(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const x = getAuth();
      console.log(x);
      // window.location.href = "/home";
    } catch (error) {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // console.log(errorCode, errorMessage)
    }
  }

  return (
  <div className={styles.loginContainer}>
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col">
          <div className={`${styles.rows} row`} style={{height: "25%"}}>
            <img src="../../../image.png" alt="logo" style={{ maxWidth: "150px", maxHeight: "250px"}} />{'Market Link'}
          </div>
          <div className={`${styles.rows} row`} style={{height: "15%"}}>
            <h1 className={styles.iniciarSesion}>Iniciar sesión</h1>
          </div>
            <div className={`${styles.rows} row`} style={{height: "30%"}}>
              <form className={styles.formContainer} onSubmit={onSubmit}>
                  <input 
                    type="text" className={`${styles.inputs}`} placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input 
                    id="txtContra" type="text" className={`${styles.inputs}`} placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button id="btnAceptar" type="submit" className={`${styles.botonTransparente}`} style={{ width: "15%" }}>Aceptar</button>
              </form>
            </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
