// EditProduct.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { getProduct, updateProduct } from '../../src/assets/Api';
import { Product } from '../../src/assets/Classes'; 
import { toast } from 'react-toastify';
import styles from './EditProduct.module.css';

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

  useEffect(() => {
    if (productId) {
      getProduct(productId).then(productData => {
        if (productData) {
          setProduct({
            name: productData.name,
            category: productData.category,
            price: productData.price,
            stock: productData.stock,
            description: productData.description
          });
        }
      }).catch(error => {
        toast.error(`Failed to load product: ${error.message}`);
      });
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }) as ProductFormState);
  };

  const handleSave = async () => {
    if (!product || !productId) {
      toast.error("Missing product information, please check all fields.");
      return;
    }

    try {
      await updateProduct(productId, product as Product);
      toast.success('Product updated successfully!');
      navigate('/entrepreneur-profile');
    } catch (error: any) {
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container className={styles.mainContainerEditProduct}>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="name" value={product?.name} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="category" value={product?.category} onChange={handleChange}>
                <option value="One">One</option>
                <option value="Two">Two</option>
                <option value="Three">Three</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="price" value={product?.price.toString()} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={product?.stock.toString()} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={product?.description} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={handleSave}>Guardar Cambios</Button>
      </Form>
    </Container>
  );
};

export default EditProduct;
