import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import styles from "./EntrepreneurRegistration.module.css";
import { auth, storage } from "../../src/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Entrepreneur } from "../../src/assets/Classes.tsx";
import { addEntrepreneur } from "../../src/assets/Api.jsx";
import { useNavigate } from "react-router-dom";
import { useHighContrast } from "../../src/assets/HighContrastContext";

const EntrepreneurRegistration: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const navigate = useNavigate();

  const { isHighContrast } = useHighContrast();

  const homeClass = isHighContrast
    ? `${styles.home} ${styles.highContrast}`
    : styles.home;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      let logoUrl = "";
      if (logo) {
        const logoStorageRef = ref(storage, `logos/${user.uid}/${logo.name}`);
        const uploadTaskSnapshot = await uploadBytes(logoStorageRef, logo);
        logoUrl = await getDownloadURL(uploadTaskSnapshot.ref);
      }

      if (!user?.uid || !email) {
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

      window.location.href = "/login";
    } catch (e) {}
  };

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(file);
    }
  }
  const handleHome = async () => {
    navigate("/");
  };
  return (
    <div className={homeClass}>
      <Container className={styles.registrationContainer}>
        <Row className={styles.centeredContent}>
          <Col>
            <div className={`${styles.rowsRegisterEntrepreneur} row`}>
              <a onClick={handleHome} style={{ cursor: "pointer" }}>
                <img
                  src="../../image.png"
                  alt="logo"
                  className={styles.logoStyle}
                />
              </a>
            </div>
            <Form onSubmit={handleSubmit} className={styles.formContainer}>
              <h3 className={styles.iniciarSesionEntrepreneurRegistration}>
                Register as an Entrepreneur
              </h3>
              <Form.Group>
                <Form.Control
                  className={styles.inputsEntrepreneurRegistration}
                  type="text"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className={styles.inputsEntrepreneurRegistration}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className={styles.inputsEntrepreneurRegistration}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className={styles.inputsEntrepreneurRegistration}
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className={styles.taEntrepreneurRegistration}
                  as="textarea"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-4">
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              <Button
                variant="custom"
                type="submit"
                className={styles.submitButtonEntrepenuerRegistration}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EntrepreneurRegistration;
