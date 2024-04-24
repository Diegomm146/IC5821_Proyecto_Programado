import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import styles from './EntrepreneurRegistration.module.css';


const EntrepreneurRegistration: React.FC = () => {

const [businessName, setBusinessName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [description, setDescription] = useState('');
const [province, setProvince] = useState('');
const [canton, setCanton] = useState('');
const [district, setDistrict] = useState('');
const [logo, setLogo] = useState<File | null>(null);

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
const fileList = event.target.files;
if (fileList) {
    setLogo(fileList[0]);
}
};

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
        <h3 className={styles.iniciarSesion}>Registrarse como emprendedor</h3>
        <Form.Group controlId="formBusinessName" className="mb-3">
            <Form.Control
            type="text"
            placeholder="Nombre del emprendimiento"
            className={styles.formControl}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mb-3">
            <Form.Control
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mb-3">
            <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="formPhoneNumber" className="mb-3">
            <Form.Control
            type="tel"
            placeholder="Numero de telefono"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-3">
            <Form.Control
            as="textarea"
            placeholder="Descripcion"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </Form.Group>
        {/* Dropdowns for Province, Canton, District */}
        {/* Replace with actual options */}
        <Row>
            <Col>
            <Form.Select value={province} onChange={(e) => setProvince(e.target.value)} className="mb-3">
                <option>Provincia</option>
            </Form.Select>
            </Col>
            <Col>
            <Form.Select value={canton} onChange={(e) => setCanton(e.target.value)} className="mb-3">
                <option>Canton</option>
            </Form.Select>
            </Col>
            <Col>
            <Form.Select value={district} onChange={(e) => setDistrict(e.target.value)} className="mb-3">
                <option>Distrito</option>
            </Form.Select>
            </Col>
        </Row>
        <Form.Group controlId="formFile" className="mb-4">
            <Form.Label htmlFor="logoUpload" className="mb-3">
            Seleccionar Logo
            </Form.Label>
            <Form.Control
            type="file"
            id="logoUpload"
            onChange={handleFileChange}
            className="form-control-file"
            />
        </Form.Group>
        <Button variant="custom" type="submit" className={styles.submitButton}>Enviar</Button>
        </Form>
    </Col>
    </Row>
</Container>
);
};

export default EntrepreneurRegistration;
