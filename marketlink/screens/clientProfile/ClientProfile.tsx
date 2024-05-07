import { FunctionComponent, useEffect, useState } from "react";
import styles from "./ClientProfile.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getUser } from "../../src/assets/Api";
import { User } from "../../src/assets/Classes";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
import { toast } from 'react-toastify';
import { redirect } from "react-router-dom";
import { set } from "firebase/database";


const ClientProfile: FunctionComponent = () => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate(); 
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(await getUser(user.uid));
      } else { 
        navigate("/login");
      }
    });
  }, [auth, navigate]);

  const handlePasswordReset = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        toast.info("Password reset email sent!");
      } catch (error) {
        toast.error("Failed to send password reset email:" + error);
      }
    } else {
      alert("User email not available!");
    }
  };

  return (
    <html>
      <body className={styles.mainContainerClientProfile}>
        <Stack gap={4} style={{paddingTop:"100px", width:"400px"}}>
          <Card className={styles.cardClientProfile}>
            <Card.Body style={{ display: "flex", alignItems: "center" }}>
              <span>Email: {user?.email}</span>
            </Card.Body>
          </Card>
          <Card className={styles.cardClientProfile}>
            <Card.Body style={{ display: "flex", alignItems: "center" }}>
              <span>Username: {user?.name}</span>
              <a href="#" className={styles.editButton} style={{ marginLeft: "auto" }}>
                <img src="../../../edit.png" alt="Edit" style={{width:"55%"}} />
              </a>
            </Card.Body>
          </Card>
          <Button className={styles.buttonClientProfile} onClick={() => navigate('/cart')}>Go to Cart</Button> {/* Button to navigate to Cart */}
          <Button className={styles.buttonClientProfile} onClick={handlePasswordReset}>Change Password</Button>{' '}
          <Button className={styles.buttonClientProfile} href="/client-orders">Orders</Button>{' '}
        </Stack>
      </body>
    </html>
  );
};

export default ClientProfile;
