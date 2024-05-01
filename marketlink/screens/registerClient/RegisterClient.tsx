import { FunctionComponent, useState } from "react";
import styles from "./RegisterClient.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { db, auth } from "../../src/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegisterClient: FunctionComponent = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to store error message

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
      });
      console.log("Firestore document set for user:", user.uid);

      // Redirect or handle post-registration logic
      window.location.href = "/login";
    } catch (error:any) {
      console.error("Error in user registration:", error);

      let errorMessage = "";

      switch (error.code) {
        case "auth/weak-password":
          errorMessage = "La contraseña es demasiado débil. Por favor, elija una contraseña más segura.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "Ya existe una cuenta con la dirección de correo electrónico proporcionada.";
          break;
        case "auth/invalid-email":
          errorMessage = "La dirección de correo electrónico proporcionada no es válida. Por favor, ingrese una dirección de correo electrónico válida.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Las cuentas de correo electrónico/contraseña no están habilitadas. Habilita las cuentas de correo electrónico/contraseña en la Consola de Firebase, en la pestaña de Auth.";
          break;
        default:
          errorMessage = "Se produjo un error durante el registro. Por favor, inténtelo de nuevo más tarde.";
      }

      setError(errorMessage);
    }
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
            <h1 className={styles.iniciarSesionRegisterClient}>Registrarse</h1>
          </div>
            <div className={`${styles.rowsRegisterClient} row`} style={{height: "30%"}}>
              <form className={styles.formContainerRegisterClient} method="post" onSubmit={handleSubmit}>
                  <input 
                    type="text" className={`${styles.inputsRegisterClient}`} placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input 
                    type="text" className={`${styles.inputsRegisterClient}`} placeholder="Nombre de Usuario"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <input 
                    type="text"  className={`${styles.inputsRegisterClient}`} placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="submit" value="Submit" className={`${styles.botonTransparenteRegisterClient}`} style={{ width: "15%", marginBottom:"15px" }}>Aceptar</button>
                    {error && (
                      <div className="alert alert-danger alert-dismissible">
                        <button type="button" className="close" onClick={() => setError("")}><img src="../../delete.png" width={20}/></button>
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
