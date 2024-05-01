import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import styles from "./EntrepreneurRegistration.module.css";
import { auth, storage } from "../../src/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Entrepreneur } from '../../src/assets/Classes.tsx'; 
import { addEntrepreneur } from '../../src/assets/Api.tsx'; 

const EntrepreneurRegistration: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    console.log("Submitting form with data:", { businessName, email, password, phoneNumber, description, logo });
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase Auth User Created:", user);
  
      let logoUrl = "";
      if (logo) {
        const logoStorageRef = ref(storage, `logos/${user.uid}/${logo.name}`);
        const uploadTaskSnapshot = await uploadBytes(logoStorageRef, logo);
        logoUrl = await getDownloadURL(uploadTaskSnapshot.ref);
        console.log("Logo uploaded and URL fetched:", logoUrl);
      }
    
      if (!user?.uid || !email) {
        console.error("Required user information is missing.");
        return;
      }
  
      const entrepreneur = new Entrepreneur(
        user.uid, 
        description,
        email,
        logoUrl,
        businessName,
        phoneNumber,
      );
  
      await addEntrepreneur(entrepreneur);
      console.log("Entrepreneur added to Firestore with ID:", user.uid);
  
      window.location.href = "/entrepreneur-profile";
    } catch (e) {
      console.error("Error in user registration and data insertion:", e);
    }
  };

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(file);
      console.log("Logo file set for upload:", file);
    }
  }

  return (
    <Container className={styles.registrationContainer}>
      <Row>
        <Col  style={{margin:"auto"}}>
          <div className={`${styles.rowsRegisterEntrepreneur} row`} style={{height: "25%"}}>
            <img src="../../image.png" alt="logo" style={{ maxWidth: "200px", maxHeight: "250px", paddingTop: "100px"}} />
          </div>
          <Form onSubmit={handleSubmit} className={styles.formContainer}>
            <h3 className={styles.iniciarSesionEntrepreneurRegistration}>
              Registrarse como emprendedor
            </h3>
            <Form.Group>
              <Form.Control
                className={styles.inputsEntrepreneurRegistration}
                type="text"
                placeholder="Nombre del emprendimiento"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className={styles.inputsEntrepreneurRegistration}
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className={styles.inputsEntrepreneurRegistration}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className={styles.inputsEntrepreneurRegistration}
                type="tel"
                placeholder="Numero de telefono"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className={styles.taEntrepreneurRegistration}
                as="textarea"
                placeholder="Descripcion"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-4">
              <Form.Control
                type="file"
                onChange={handleFileChange}
                className="form-control-file"
              />
            </Form.Group>
            <Button
              variant="custom"
              type="submit"
              className={styles.submitButtonEntrepenuerRegistration}
            >
              Enviar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default EntrepreneurRegistration;
