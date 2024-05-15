import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Entrepreneur, Product } from "../../src/assets/Classes";
import { getProductsByEntrepreneur, deleteProduct } from "../../src/assets/Api";
import styles from "./EntrepreneurProfile.module.css";
import { toast } from "react-toastify";
import { useHighContrast } from "../../src/assets/HighContrastContext.tsx";

interface ItemProps {
  name: string;
  price: number;
  imagesURL: string[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

const Item: React.FunctionComponent<ItemProps> = ({
  name,
  price,
  imagesURL,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.itemContainerEntrepreneurProfile}>
      <a
        href={"/product-view"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View details of ${name}`}
      >
        <img
          src={imagesURL[0] || "../../defaultproduct.png"}
          className={styles.imgItemEntrepreneurProfile}
          alt={`Image of ${name}`}
        />
      </a>
      <div className={styles.productDetails}>
        <p className={styles.textItemEntrepreneurProfile}>{name}</p>
        <p className={styles.textItemEntrepreneurProfile}>
          ${price.toFixed(2)}
        </p>
        <Button
          variant="outline-primary"
          onClick={() => onEdit(name)}
          className={styles.editButton}
          aria-label={`Edit ${name}`}
        >
          Edit
        </Button>
        <Button
          variant="outline-danger"
          onClick={() => onDelete(name)}
          className={styles.deleteButton}
          aria-label={`Delete ${name}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

const EntrepreneurProfile: React.FC = () => {
  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const { isHighContrast } = useHighContrast();

  const homeClass = isHighContrast
    ? `${styles.home} ${styles.highContrast}`
    : styles.home;

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setEntrepreneur(userData);

      if (userData.uid) {
        getProductsByEntrepreneur(userData.uid)
          .then((products) => setProducts(products))
          .catch(() => {});
      }
    }
  }, []);

  const handleEditProduct = (productId: string) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    const success = await deleteProduct(productId);
    if (success) {
      setProducts((currentProducts) =>
        currentProducts.filter((p) => p.id !== productId),
      );
      toast.success("Product deleted successfully");
    } else {
      toast.error("Failed to delete product");
    }
  };

  const handleCreateProductClick = () => {
    navigate("/create-product");
  };

  if (!entrepreneur) {
    return (
      <Container className="text-center py-5">
        <h1>Loading...</h1>
      </Container>
    );
  }

  return (
    <div className={homeClass}>
      <Container className={styles.EntrepreneurProfileContainer} fluid>
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <Card className={styles.profileCard}>
              <Card.Body>
                <Row>
                  <Col xs={6}>
                    <Image
                      src={entrepreneur.logoURL || "../../defaultpp.png"}
                      rounded
                      height="100"
                      alt="Profile logo"
                    />
                  </Col>
                </Row>
                <Card.Title className={styles.nameEntrepreneurProfile}>
                  {entrepreneur.name}
                </Card.Title>
                <Card.Text className={styles.descEntrepreneurProfile}>
                  {entrepreneur.description}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {entrepreneur.email}
                </Card.Text>
                <Card.Text>
                  <strong>Telephone:</strong> {entrepreneur.phoneNumber}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={10}>
            <h2 className={styles.titleEntrepreneurProfile}>
              Our Products
              <Button
                className={styles.footerButton}
                onClick={handleCreateProductClick}
                aria-label="Create new product"
              >
                <FaPlus />
              </Button>
            </h2>
            <Row>
              {products.map((product) => (
                <Col xs={6} md={4} lg={3} key={product.id}>
                  <Item
                    name={product.name}
                    price={product.price}
                    imagesURL={product.imagesURL}
                    onEdit={() => handleEditProduct(product.id)}
                    onDelete={() => handleDeleteProduct(product.id)}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EntrepreneurProfile;
