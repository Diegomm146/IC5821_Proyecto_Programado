import { useState, FormEvent } from "react";
import { signIn } from "../../src/assets/Api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../src/firebase/firebaseConfig";
import { useAuth } from "../../util/AuthContext";
import { useHighContrast } from "../../src/assets/HighContrastContext";

interface LoginResult {
  error?: string;
  route?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const { isHighContrast } = useHighContrast();
  const homeClass = isHighContrast
    ? `${styles.home} ${styles.highContrast}`
    : styles.home;

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
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const result: LoginResult = await signIn(email, password);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Login successful");
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
        }
        if (result.route) {
          navigate(result.route);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred.";
      toast.error(errorMessage);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        toast.info("Password reset email sent!");
      } catch (error: unknown) {
        const errorMessage =
          (error as Error).message || "Failed to send password reset email.";
        toast.error(errorMessage);
      }
    }
  };
  const handleRegisterClient = async () => {
    navigate("/register-client");
  };
  const handleRegisterSeller = async () => {
    navigate("/register-entrepreneur");
  };
  const handleHome = async () => {
    navigate("/");
  };

  return (
    <div className={homeClass}>
      <div className={styles.loginContainer}>
        <main className="container-fluid h-100">
          <div className="row h-100">
            <div className="col">
              <header
                className={`${styles.rows} row`}
                style={{ height: "25%" }}
              >
                <a
                  onClick={handleHome}
                  style={{ cursor: "pointer" }}
                  role="button"
                  aria-label="Return to home"
                >
                  <img
                    src="../../../image.png"
                    alt="logo"
                    style={{ maxWidth: "150px", maxHeight: "250px" }}
                  />
                </a>
                <h1 className={styles.iniciarSesion}>Market Link</h1>
              </header>
              <section
                className={`${styles.rows} row`}
                style={{ height: "15%" }}
              >
                <h1 className={styles.iniciarSesion}>Login</h1>
              </section>
              <section
                className={`${styles.rows} row`}
                style={{ height: "30%" }}
              >
                <form
                  className={styles.formContainer}
                  onSubmit={onSubmit}
                  aria-label="Login form"
                >
                  <input
                    type="email"
                    className={styles.inputs}
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                  />
                  <input
                    type="password"
                    className={styles.inputs}
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                  />
                  <button
                    type="submit"
                    className={styles.botonTransparente}
                    aria-label="Submit login"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className={styles.botonTransparente}
                    onClick={handlePasswordReset}
                    aria-label="Reset password"
                  >
                    Change Password
                  </button>
                  <p>
                    Register as
                    <a
                      className={styles.linkRegisterLogin}
                      onClick={handleRegisterClient}
                      role="button"
                      aria-label="Register as client"
                    >
                      Client
                    </a>
                    /
                    <a
                      className={styles.linkRegisterLogin}
                      onClick={handleRegisterSeller}
                      role="button"
                      aria-label="Register as entrepreneur"
                    >
                      Entrepreneur
                    </a>
                  </p>
                </form>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
