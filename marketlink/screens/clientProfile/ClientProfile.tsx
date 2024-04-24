import { FunctionComponent } from "react";
import styles from "./ClientProfile.module.css";
import 'bootstrap/dist/css/bootstrap.css';

const ClientProfile: FunctionComponent = () => {
  return (
    <div className={styles.mainContainerClientProfile}>
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
    </div>
  );
};

export default ClientProfile;
