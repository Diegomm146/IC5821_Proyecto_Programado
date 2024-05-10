import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { getProductString, updateProduct } from "../../src/assets/Api";
import { Product } from "../../src/assets/Classes";
import { toast } from "react-toastify";
import styles from "./EditProduct.module.css";
import { useHighContrast } from "../../src/assets/HighContrastContext.tsx";

interface ProductFormState extends Partial<Product> {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

const EditProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductFormState | null>(null);
  const navigate = useNavigate();

  const { isHighContrast } = useHighContrast();

  const homeClass = isHighContrast
    ? `${styles.home} ${styles.highContrast}`
    : styles.home;

  useEffect(() => {
    if (productId) {
      getProductString(productId)
        .then((productData) => {
          if (productData) {
            setProduct({
              name: productData.name,
              category: productData.category,
              price: productData.price,
              stock: productData.stock,
              description: productData.description,
            });
          }
        })
        .catch((error) => {
          toast.error(`Failed to load product: ${error.message}`);
        });
    }
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProduct(
      (prev) =>
        ({
          ...prev,
          [name]:
            name === "price" || name === "stock" ? parseFloat(value) : value,
        }) as ProductFormState,
    );
  };

  const handleSave = async () => {
    if (!product || !productId) {
      toast.error("Missing product information, please check all fields.");
      return;
    }

    try {
      await updateProduct(productId, product as Product);
      toast.success("Product updated successfully!");
      navigate("/entrepreneur-profile");
    } catch (error: any) {
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={homeClass}>
      <Container className={styles.mainContainerEditProduct}>
        <Form>
          <h1 className={styles.titleEditProduct}>Edit Product</h1>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className={styles.formLabelEditProduct}>
                  Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={product?.name || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className={styles.formLabelEditProduct}>
                  Category
                </Form.Label>
                <Form.Select
                  name="category"
                  value={product?.category || ""}
                  onChange={handleChange}
                  className={styles.formLabelEditProduct}
                >
                  <option value="">Select an option</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home-appliances">Home Appliances</option>
                  <option value="books">Books</option>
                  <option value="sports">Sports</option>
                  <option value="beauty-health">Beauty & Health</option>
                  <option value="toys">Toys</option>
                  <option value="food-drink">Food & Drink</option>
                  <option value="automotive">Automotive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className={styles.formLabelEditProduct}>
                  Price
                </Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={product?.price.toString() || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className={styles.formLabelEditProduct}>
                  Stock
                </Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={product?.stock.toString() || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className={styles.formLabelEditProduct}>
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={product?.description || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            type="button"
            onClick={handleSave}
            className={styles.btnEditProduct}
          >
            Save Changes
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default EditProduct;
