import { FunctionComponent, useState } from "react";
import { signIn } from '../../src/assets/Api.tsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Login.module.css";
import 'bootstrap/dist/css/bootstrap.css';

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Please complete both email and password fields.");
      return false;
    }
    
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return false;
    }
    return true;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Login attempt initiated...");
    event.preventDefault();

    if (!validateInputs()) return;

    const result = await signIn(email, password); 
    if (result && result.error) {
      toast.error(result.error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col">
            <div className={`${styles.rows} row`} style={{height: "25%"}}>
              <img src="../../../image.png" alt="logo" style={{ maxWidth: "150px", maxHeight: "250px"}} />{'Market Link'}
            </div>
            <div className={`${styles.rows} row`} style={{height: "15%"}}>
              <h1 className={styles.iniciarSesion}>Login</h1>
            </div>
            <div className={`${styles.rows} row`} style={{height: "30%"}}>
              <form className={styles.formContainer} onSubmit={onSubmit}>
                  <input 
                    type="email" className={`${styles.inputs}`} placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input 
                    type="password" className={`${styles.inputs}`} placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="submit" className={`${styles.botonTransparente}`} style={{ width: "15%" }}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
