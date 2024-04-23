import { FunctionComponent } from "react";
import styles from "./ClientProfile.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../../src/components/header/Header';

const ClientProfile: FunctionComponent = () => {
  return (
    <html>
        <header >
          <Header/>
        </header>  
        <div className={styles.mainContainer}>
            
        </div>
    </html>
  );
};

export default ClientProfile;
