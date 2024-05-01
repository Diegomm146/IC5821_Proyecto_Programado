import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import styles from './EntrepreneurProfile.module.css';
import { Entrepreneur } from '../../src/assets/Classes';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

const products: Product[] = [
  // Datos de productos
];

interface ItemProps {
  name: string;
  price: number;
  imageUrl: string;
}

const Item: React.FunctionComponent<ItemProps> = ({ name, price, imageUrl }) => {
  return (
    <div className={styles.itemContainerEntrepreneurProfile}>
      <a href={"/product-view"} target="_blank" rel="noopener noreferrer">
        <img src={imageUrl || '../../defaultproduct.png'} className={styles.imgItemEntrepreneurProfile} />
      </a>
      <div className={styles.productDetails}>
        <p className={styles.textItemEntrepreneurProfile}>{name}</p>
        <p className={styles.textItemEntrepreneurProfile}>${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

const EntrepreneurProfile: React.FC = () => {
  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const navigate = useNavigate();  // Hook para la navegación

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString) as Entrepreneur;
      setEntrepreneur(userData);
    }
  }, []);

  const handleCreateProductClick = () => {
    navigate('/create-product');  // Redirecciona a la página de creación de producto
  };
  if (!entrepreneur) {
    return <Container className="text-center py-5"><h1>Loading...</h1></Container>;
  }

  return (
    <Container className={styles.EntrepreneurProfileContainer} fluid>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className={styles.profileCard}>
            <Card.Body>
              <Row>
                <Col xs={6}>
                  <Image src={entrepreneur.logoURL || '../../defaultpp.png'} rounded height="100" />
                </Col>
                <Col xs={6} className="text-right">
                  <Button variant="link"><FaPencilAlt /></Button>
                </Col>
              </Row>
              <Card.Title className={styles.nameEntrepreneurProfile}>{entrepreneur.name}</Card.Title>
              <Card.Text className={styles.descEntrepreneurProfile}>{entrepreneur.description}</Card.Text>
              <Card.Text><strong>Email:</strong> {entrepreneur.email}</Card.Text>
              <Card.Text><strong>Teléfono:</strong> {entrepreneur.phoneNumber}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={10}>
        <h2 className={styles.titleEntrepreneurProfile}>
        Nuestros Productos 
        <Button variant="success" onClick={handleCreateProductClick}>
          <FaPlus />
        </Button>
      </h2>
          <Row>
            {products.map(product => (
              <Col xs={6} md={4} lg={3} key={product.id}>
                <Item name={product.name} price={product.price} imageUrl={product.imageUrl} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default EntrepreneurProfile;
