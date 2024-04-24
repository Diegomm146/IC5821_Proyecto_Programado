import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './EntrepreneurProfile.module.css';
import Header from '../../src/components/header/Header';
import Footer from "../../src/components/footer/Footer";

type Product = {
id: number;
name: string;
price: number;
imageUrl: string;
};

const products: Product[] = [];

const EntrepreneurProfile: React.FC = () => {
return (
<>
    <Header />
    <Container fluid>
    <Row>
        <Col className="text-center">
        <h2>Nombre Emprendedor</h2>
        <div>Logo Emprendedor</div>
        </Col>
        <Col>
        <Card body>
            <Card.Title>Descripcion del emprendedor</Card.Title>
            <Card.Text>
            {/* Descripcion del emprendedor aca */}
            </Card.Text>
        </Card>
        </Col>
    </Row>

    <Row className="justify-content-md-center">
        <Col md={12}>
        <h3>Nuestros productos</h3>
        <Button>+</Button>
        </Col>
    </Row>

    <Row xs={1} md={2} lg={4} className="g-4">
        {products.map(product => (
        <Col key={product.id}>
            <Card>
            <Card.Img variant="top" src={product.imageUrl} />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>${product.price}</Card.Text>
            </Card.Body>
            </Card>
        </Col>
        ))}
    </Row>
    </Container>
    <Footer />
</>
);
};

export default EntrepreneurProfile;
