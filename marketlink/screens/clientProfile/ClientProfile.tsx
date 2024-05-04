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
import { toast } from 'react-toastify';
import { redirect } from "react-router-dom";
import { set } from "firebase/database";


const ClientProfile: FunctionComponent = () => {
  const [user, setUser] = useState<User>();
  const [uid, setUid] = useState<string>("");

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
      if (user) {
          setUid(user.uid);
      } else { 
        redirect("/login");
        return;
      }
  });
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) {
        redirect("/login");
        return;
      }
      try {
        setUser(await getUser(uid));
      } catch (error) {
        toast.error("Failed to fetch user:" + error);
        setUser(undefined); 
      }
    };

    fetchUser();
  }, [user, uid]);

  const handlePasswordReset = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        toast.info("Password reset email sent!");
      } catch (error) {
        toast.error("Failed to send password reset email:" + error);
        alert("Failed to send password reset email.");
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
          <Button className={styles.buttonClientProfile} onClick={handlePasswordReset}>Change Password</Button>{' '}
          <Button className={styles.buttonClientProfile} href="/client-orders">Orders</Button>{' '}
        </Stack>
      </body>
    </html>
  );
};

export default ClientProfile;
