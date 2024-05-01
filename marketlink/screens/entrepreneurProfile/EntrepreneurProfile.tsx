import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Image, Stack } from 'react-bootstrap';
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


  return (
    <body className={styles.EntreprenerurProfilecontainer}>
      <div>
        <Row>
          <Col md={{ span: 3, offset: 3 }} >
            <Card style={{border:"none"}}>
              <Card.Img variant="top" src="../../defaultpp.png" />
              <Card.Body>
                <Card.Title className={styles.nameEntrepreneurProfile}>Nombre Emprendedor</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className={styles.descEntrepreneurProfile}>
            <p style={{margin:"auto"}}>
              Aquí puedes añadir la descripción del emprendedor. Este texto puede ser tan extenso como sea necesario y se ajustará a este lado de la tarjeta.
            </p>
          </Col>
        </Row>
      </div>
      <div>
        <h2 className={styles.titleEntrepreneurProfile}>Nuestros Productos</h2>
      </div>
      <div>
        <Container className={styles.EntreprenerurProfileProducts}>
          <Stack direction="horizontal" gap={2} className={styles.horizontalWrapperEntrepreneurProfile}>
            {products.map((product) => (
              <Item key={product.id} name={product.name} price={product.price} imageUrl={product.imageUrl} />
            ))}
          </Stack>
        </Container>
      </div>
    </body>
  );
};
interface ItemProps {
  name: string;
  price: number;
  imageUrl: string;
}
const Item: React.FunctionComponent<ItemProps> = ({ name, price, imageUrl }) => {
  return (
    <div className={styles.itemContainerEntrepreneurProfile}>
      <a href={"/product-view"} target="_blank" rel="noopener noreferrer">
        <img src={'../../defaultproduct.png'}  className={styles.imgItemEntrepreneurProfile} />
      </a>
      <div className={styles.productDetails}>
        <p className={styles.textItemEntrepreneurProfile}>{name}</p>
        <p className={styles.textItemEntrepreneurProfile}>${price.toFixed(2)}</p>
      </div>
    </div>
  );
};
export default EntrepreneurProfile;
