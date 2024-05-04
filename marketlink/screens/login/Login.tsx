import { useState, FormEvent } from "react";
import { signIn } from '../../src/assets/Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Login.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../src/firebase/firebaseConfig";
import { useAuth } from '../../util/AuthContext';

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
    console.log("Login attempt with:", email);  // Logging only email for privacy
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const result: LoginResult = await signIn(email, password);
      if (result.error) {
          toast.error(result.error);
      } else {
          toast.success("Login successful");
          const storedUserData = localStorage.getItem('userData');
          if (storedUserData) {
              const userData = JSON.parse(storedUserData);
              setUser(userData);
              console.log("User set after login:", userData);
          }
          if (result.route) {
              navigate(result.route);
          }
      }
    } catch (error: any) {
        const errorMessage = (error as Error).message || "An unknown error occurred.";
        toast.error(errorMessage);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
        toast.error("Please enter your email address first.");
        return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.info("Password reset email sent!");
    } catch (error: any) {
      const errorMessage = (error as Error).message || "Failed to send password reset email.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col">
            <div className={`${styles.rows} row`} style={{ height: "25%" }}>
              <img src="../../../image.png" alt="logo" style={{ maxWidth: "150px", maxHeight: "250px" }} />
              {'Market Link'}
            </div>
            <div className={`${styles.rows} row`} style={{ height: "15%" }}>
              <h1 className={styles.iniciarSesion}>Login</h1>
            </div>
            <div className={`${styles.rows} row`} style={{ height: "30%" }}>
              <form className={styles.formContainer} onSubmit={onSubmit}>
                <input 
                  type="email" 
                  className={styles.inputs} 
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  type="password" 
                  className={styles.inputs} 
                  placeholder="Password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="submit" 
                  className={styles.botonTransparente} 
                >
                  Submit
                </button>
                <button 
                  type="button" 
                  className={styles.botonTransparente} 
                  onClick={handlePasswordReset}
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
