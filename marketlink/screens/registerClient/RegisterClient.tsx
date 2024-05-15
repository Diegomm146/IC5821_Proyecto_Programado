import { FunctionComponent, useState, useRef, useEffect } from "react";
import styles from "./RegisterClient.module.css"; // Cambiamos el CSS de registro
import "bootstrap/dist/css/bootstrap.css";
import { db, auth } from "../../src/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useHighContrast } from "../../src/assets/HighContrastContext";

const RegisterClient: FunctionComponent = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isHighContrast } = useHighContrast();
  const homeClass = isHighContrast
    ? `${styles.home} ${styles.highContrast}`
    : styles.home;
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (h1Ref.current) {
      h1Ref.current.focus();
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "User", user.uid), {
        name: userName,
        email: email,
        type: "client",
      });

      await addDoc(collection(db, "Cart"), {
        user: doc(db, "User", user.uid),
      });
      toast.success("User registered successfully!");
      navigate("/login");
    } catch (error: any) {
      let errorMessage = error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className={homeClass}>
      <div className={styles.container}>
        <main className="container-fluid h-100">
          <div className="row h-100">
            <div className="col">
              <header
                className={`${styles.rows} row`}
                style={{ height: "25%" }}
              >
                <img
                  src="../../../image.png"
                  alt="home logo"
                  className={styles.logo}
                />
              </header>
              <section
                className={`${styles.rows} row`}
                style={{ height: "15%" }}
              >
                <h1 ref={h1Ref} tabIndex={-1} className={styles.iniciarSesion}>
                  Register
                </h1>
              </section>
              <section
                className={`${styles.rows} row`}
                style={{ height: "30%" }}
              >
                <form className={styles.formContainer} onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className={styles.inputs}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email Address"
                    aria-required="true"
                  />
                  <input
                    type="text"
                    className={styles.inputs}
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    aria-label="Username"
                    aria-required="true"
                  />
                  <input
                    type="password"
                    className={styles.inputs}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                    aria-required="true"
                  />
                  <button
                    type="submit"
                    className={styles.botonTransparente}
                    aria-label="Accept and register"
                  >
                    Accept
                  </button>
                  {error && (
                    <div
                      className="alert alert-danger alert-dismissible"
                      aria-live="assertive"
                    >
                      <button
                        type="button"
                        className="close"
                        onClick={() => setError("")}
                        aria-label="Close Alert"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <strong>Error!</strong> {error}
                    </div>
                  )}
                </form>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegisterClient;
