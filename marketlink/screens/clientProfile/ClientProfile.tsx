import { FunctionComponent, useEffect, useState } from "react";
import styles from "./ClientProfile.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getUser, updateClientUserName } from "../../src/assets/Api";
import { User } from "../../src/assets/Classes";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { redirect } from "react-router-dom";
import { set } from "firebase/database";


const ClientProfile: FunctionComponent = () => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate(); 
  const [showUpdateUsername, setShowUpdateUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

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
  const handleUpdateUsername = async () => {
    if (user && newUsername) {
      try {
        await updateClientUserName(user.id, newUsername);
        toast.success("Username updated successfully!");
        setUser({ ...user, name: newUsername });
        setShowUpdateUsername(false);
      } catch (error: any) {
        toast.error("Failed to update username: " + error.message);
      }
    }
  };

  return (
<div className={styles.mainContainerClientProfile}>
      <Stack gap={4} style={{ paddingTop: "100px", width: "400px" }}>
        <Card className={styles.cardClientProfile}>
          <Card.Body style={{ display: "flex", alignItems: "center" }}>
            <span>Email: {user?.email}</span>
          </Card.Body>
        </Card>
        <Card className={styles.cardClientProfile}>
          <Card.Body style={{ display: "flex", alignItems: "center" }}>
            <span>Username: {user?.name}</span>
            <a onClick={() => setShowUpdateUsername(!showUpdateUsername)} className={styles.editButton} style={{ cursor:"pointer", marginLeft: "auto" }}>
              <img src="../../../edit.png" alt="Edit" style={{width:"55%"}} />
            </a>
          </Card.Body>
          {showUpdateUsername && (
            <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                style={{ flexGrow: 1, marginRight: "10px" }}
              />
              <Button variant="success" onClick={handleUpdateUsername}>Confirm</Button>
              <Button variant="danger" onClick={() => setShowUpdateUsername(false)}>Cancel</Button>
            </div>
          )}
        </Card>
        <Button className={styles.buttonClientProfile} onClick={() => navigate('/cart')}>Go to Cart</Button>
        <Button className={styles.buttonClientProfile} onClick={handlePasswordReset}>Change Password</Button>
        <Button className={styles.buttonClientProfile} href="/client-orders">Orders</Button>
      </Stack>
    </div>
  );
};

export default ClientProfile;
