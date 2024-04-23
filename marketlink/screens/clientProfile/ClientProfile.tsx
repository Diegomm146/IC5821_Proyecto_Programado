import { FunctionComponent } from "react";
import styles from "./ClientProfile.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../../src/components/header/Header';
import Footer from "../../src/components/footer/Footer";


const ClientProfile: FunctionComponent = () => {
  return (
    <html>
        <header >
          <Header/>
        </header>  
        <body className={styles.mainContainerClientProfile}>
          
          <div className="container text-center">
            <div className="row">
              <div className="col">
                Column
              </div>
              <div className="col">
                Column
              </div>
              <div className="col">
                Column
              </div>
            </div>
          </div>
        </body>
        <footer>
          <Footer/>
        </footer>
    </html>
  );
};

export default ClientProfile;
