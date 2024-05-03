import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Entrepreneur, Product } from '../../src/assets/Classes';
import { getProductsByEntrepreneur } from '../../src/assets/Api';
import styles from './EntrepreneurProfile.module.css';

interface ItemProps {
  name: string;
  price: number;
  imagesURL: string[];
  onEdit: (productId: string) => void;  
}

const Item: React.FunctionComponent<ItemProps> = ({ name, price, imagesURL, onEdit }) => {
  console.log('Rendering Item:', name);  
  return (
    <div className={styles.itemContainerEntrepreneurProfile}>
      <a href={"/product-view"} target="_blank" rel="noopener noreferrer">
        <img src={imagesURL[0] || '../../defaultproduct.png'} className={styles.imgItemEntrepreneurProfile} />
      </a>
      <div className={styles.productDetails}>
        <p className={styles.textItemEntrepreneurProfile}>{name}</p>
        <p className={styles.textItemEntrepreneurProfile}>${price.toFixed(2)}</p>
        <Button variant="outline-primary" onClick={() => onEdit("")} className="mt-2">Editar</Button>
      </div>
    </div>
  );
};

const EntrepreneurProfile: React.FC = () => {
  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Checking local storage for user data...');
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('Loaded entrepreneur data:', userData);
        setEntrepreneur(userData);
        console.log('Fetching products for entrepreneur UID:', userData.uid);
        if (userData.uid) {
            getProductsByEntrepreneur(userData.uid)
                .then(products => {
                    console.log('Loaded products:', products);
                    setProducts(products);
                })
                .catch(error => {
                    console.error('Failed to fetch products:', error);
                });
        } else {
            console.error('No UID found on the entrepreneur data.');
        }
    } else {
        console.error('No entrepreneur data found in local storage.');
    }
  }, []);

  const handleEditProduct = (productId: string) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleCreateProductClick = () => {
    navigate('/create-product');
  };

  if (!entrepreneur) {
    return <Container className="text-center py-5"><h1>Loading...</h1></Container>;
  }

  return (
    <Container className={styles.EntrepreneurProfileContainer} fluid>
      <Row className="justify-content-center mt-4">
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
                <Item name={product.name} price={product.price} imagesURL={product.imagesURL} onEdit={() => handleEditProduct(product.id)} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default EntrepreneurProfile;
