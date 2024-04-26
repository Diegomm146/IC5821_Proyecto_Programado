import { FunctionComponent } from "react";
import styles from "./ClientProfile.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const ClientProfile: FunctionComponent = () => {
  return (
    <html>
        <body className={styles.mainContainerClientProfile}>
          <Stack gap={4}>
            <Image className={styles.ppClientProfile}  src="../../../defaultpp.png" thumbnail />
            <Card  className={styles.cardClientProfile}>
              <Card.Body style={{ display: "flex", alignItems: "center" }}>
                <span>Correo electrónico</span>
              </Card.Body>
            </Card>
            <Card  className={styles.cardClientProfile}>
              <Card.Body style={{ display: "flex", alignItems: "center" }}>
                <span>Nombre de usuario</span>
                <a href="#" className={styles.editButton} style={{ marginLeft: "auto" }}>
                  <img src="../../../edit.png" alt="logo" style={{width:"55%"}} />
                </a>
              </Card.Body>
            </Card>
            <Card  className={styles.cardClientProfile}>
              <Card.Body style={{ display: "flex", alignItems: "center" }}>
                <span>Contraseña</span>
                <a href="#" className={styles.editButton} style={{ marginLeft: "auto" }}>
                  <img src="../../../edit.png" alt="logo" style={{width:"55%"}} />
                </a>
              </Card.Body>
            </Card>
            
            <Button className={styles.buttonClientProfile}>Métodos de pago</Button>{' '}
            <Button className={styles.buttonClientProfile}>Pedidos realizados</Button>{' '}
          </Stack>
        </body>
    </html>
  );
};

export default ClientProfile;
