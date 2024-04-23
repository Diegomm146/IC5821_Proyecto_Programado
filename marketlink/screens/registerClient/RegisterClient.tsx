import { FunctionComponent } from "react";
import styles from "./RegisterClient.module.css";
import 'bootstrap/dist/css/bootstrap.css';

const RegisterClient: FunctionComponent = () => {
  return (
  <div className={styles.loginContainerRegisterClient}>
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col">
          <div className={`${styles.rowsRegisterClient} row`} style={{height: "25%"}}>
            <img src="https://via.placeholder.com/100" alt="logo" style={{ maxWidth: "300px", maxHeight: "200px", paddingTop: "5%"}} />
          </div>
          <div className={`${styles.rowsRegisterClient} row`} style={{height: "15%"}}>
            <h1 className={styles.iniciarSesionRegisterClient}>Registrarse</h1>
          </div>
            <div className={`${styles.rowsRegisterClient} row`} style={{height: "30%"}}>
              <form className={styles.formContainerRegisterClient}>
                  <input id="txtCorreo" type="text" className={`${styles.inputsRegisterClient}`} placeholder="Correo electrónico" />
                  <input id="txtUsuario" type="text" className={`${styles.inputsRegisterClient}`} placeholder="Nombre de Usuario" />
                  <input id="txtContra" type="text" className={`${styles.inputsRegisterClient}`} placeholder="Contraseña" />
                  <button id="btnAceptar" type="submit" className={`${styles.botonTransparenteRegisterClient}`} style={{ width: "15%" }}>Aceptar</button>
                  <button id="btnGoogle" type="submit" className={`${styles.botonTransparenteRegisterClient}`}>Continuar con Google</button>
              </form>
            </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default RegisterClient;
