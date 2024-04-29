import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import styles from "./EntrepreneurRegistration.module.css";
import { db, auth, storage } from "../../src/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EntrepreneurContext from "../../util/EntrepreneurContext";

const EntrepreneurRegistration: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [province, setProvince] = useState("");
  const [canton, setCanton] = useState("");
  const [district, setDistrict] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting form with data:", { businessName, email, password, phoneNumber, description, province, canton, district, logo });
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

      await setDoc(doc(db, "Entrepreneurs", user.uid), {
        name: businessName,
        phoneNumber: phoneNumber,
        email: email,
        description: description,
        logoURL: logoUrl,
        province,
        canton,
        district
      });
      console.log("Firestore document set for user:", user.uid);

      // Redirect or handle post-registration logic
      window.location.href = "/entrepreneur-profile";
    } catch (e) {
      console.error("Error in user registration:", e);
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
      <Row className={styles.justifyContentCenter}>
        <Col md={6} className={styles.registrationFormCol}>
          <div className={styles.textCenterMb4}>
            <img
              alt="Market Link Logo"
              src="/../../../image.png"
              width="50"
              height="50"
              className="mb-2"
            />
            <h2 className={styles.registrationTitle}>Market Link</h2>
          </div>
          <Form onSubmit={handleSubmit} className={styles.formContainer}>
            <h3 className={styles.iniciarSesion}>
              Registrarse como emprendedor
            </h3>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Nombre del emprendimiento"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                placeholder="Numero de telefono"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Descripcion"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            {/* Dropdowns for Province, Canton, District */}
            {/* Replace with actual options */}
            <Row className="mb-3">
              <Col>
                <Form.Select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  <option>Provincia</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Select
                  value={canton}
                  onChange={(e) => setCanton(e.target.value)}
                >
                  <option>Canton</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option>Distrito</option>
                </Form.Select>
              </Col>
            </Row>
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
              className={styles.submitButton}
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
