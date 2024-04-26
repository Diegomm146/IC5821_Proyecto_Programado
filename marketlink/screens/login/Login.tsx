import { FunctionComponent } from "react";
import styles from "./Login.module.css";
import 'bootstrap/dist/css/bootstrap.css';

const Login: FunctionComponent = () => {
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
              <form className={styles.formContainer}>
                  <input id="txtUsuario" type="text" className={`${styles.inputs}`} placeholder="Nombre de Usuario" />
                  <input id="txtContra" type="text" className={`${styles.inputs}`} placeholder="Contraseña" />
                  <button id="btnAceptar" type="submit" className={`${styles.botonTransparente}`} style={{ width: "15%" }}>Aceptar</button>
                  <button id="btnGoogle" type="submit" className={`${styles.botonTransparente}`}>Continuar con Google</button>
              </form>
            </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
