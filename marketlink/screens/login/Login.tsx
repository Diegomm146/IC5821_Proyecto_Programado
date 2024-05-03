import {  useState , FormEvent } from "react";
import { getUserByEmail, signIn } from '../../src/assets/Api.tsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Login.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../src/firebase/firebaseConfig.tsx";
import { AuthProvider, useAuth } from '../../util/AuthContext.tsx';

interface LoginResult {
  error?: string;
  route?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useAuth(); 

  const validateInputs = (): boolean => {
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

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    console.log("Login attempt with:", email, password);
      event.preventDefault();
      if (!validateInputs()) return;

      const result: LoginResult = await signIn(email, password);
if (result.error) {
    toast.error(result.error);
} else {
    toast.success("Login successful");
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setUser(userData);  // Asegúrate de llamar a setUser con los datos recién obtenidos
        console.log("User set after login:", userData);
    }
    if (result.route) {
        navigate(result.route);
    }
}
  };

  const handlePasswordReset = async () => {
    const user = await getUserByEmail(email);
    if (user.email != "") {
      try {
        await sendPasswordResetEmail(auth, user.email);
        toast.info("Password reset email sent!");
      } catch (error) {
        toast.error("Failed to send password reset email:" + error);
        alert("Failed to send password reset email.");
      }
    } else {
      alert("User email not registered!");
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
                  <button className={`${styles.botonTransparente}`} style={{ width: "15%" }} onClick={handlePasswordReset}>Change Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;