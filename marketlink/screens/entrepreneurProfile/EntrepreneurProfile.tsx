import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import styles from './EntrepreneurProfile.module.css';
import EntrepreneurContext from '../../util/EntrepreneurContext';

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

const products: Product[] = [
  // Assuming products array is populated elsewhere or fetched from a database
];

const EntrepreneurProfile: React.FC = () => {
  const entrepreneur = useContext(EntrepreneurContext);

  useEffect(() => {
    console.log('Entrepreneur data:', entrepreneur);
  }, [entrepreneur]);

  if (!entrepreneur) {
    return <div>Loading...</div>;
  }

  return (
    <Container className={styles.container}>
      <Row className={styles.profileRow}>
        <Col md={4} className={styles.profileImageCol}>
          <Image src={entrepreneur.logoURL || '/path/to/default/image.png'} roundedCircle width="100%" />
        </Col>
        <Col md={8}>
          <Card className={styles.profileCard}>
            <Card.Body>
              <Card.Title>{entrepreneur.name}</Card.Title>
              <Card.Text>
                <strong>Email:</strong> {entrepreneur.email}<br />
                <strong>Phone Number:</strong> {entrepreneur.phoneNumber}<br />
                <strong>Description:</strong> {entrepreneur.description}<br />
                <strong>Location:</strong> {`${entrepreneur.province}, ${entrepreneur.canton}, ${entrepreneur.district}`}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className={styles.productRow}>
        <h3>Nuestros productos</h3>
        <Button variant="primary" className={styles.addButton}>Add Product</Button>
      </Row>
      <Row xs={1} md={2} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <Card className={styles.productCard}>
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
  );
};

export default EntrepreneurProfile;
