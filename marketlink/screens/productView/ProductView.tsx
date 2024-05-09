import { FunctionComponent, useEffect, useState } from "react";
import styles from "./ProductView.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { useParams } from "react-router-dom";
import { getProductById, addCartItem } from "../../src/assets/Api";
import { Product } from "../../src/assets/Classes";
import { auth } from "../../src/firebase/firebaseConfig";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const ProductView: FunctionComponent = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (productId) {
            getProductById(productId)
                .then(fetchedProduct => {
                    setProduct(fetchedProduct);
                })
                .catch(() => {
                    
                    setProduct(null);
                });
        }
    }, [productId]);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(Number(event.target.value));
    };

    const handleAddToCart = () => {
        if (!product || !auth.currentUser) {
            toast.error("No product or user not logged in.");
            return;
        }

        if (quantity > 0 && quantity <= product.stock) {
            addCartItem(auth.currentUser.uid, product.price, product.id, quantity)
                .then(() => {
                    toast.info("Product added to cart.");
                })
                .catch(error => {
                    toast.error("Error adding product to cart:", error);
                });
        } else {
            toast.error("Invalid quantity. Please adjust the quantity within available stock.");
        }
    };

    return (
        <Container className={styles.mainContainerProductView}>
            <Row>
                <Col md={6}>
                    <Image src={product?.imagesURL[0] || '../../defaultproduct.png'} rounded className={styles.mainImgProductView} alt={`Image of ${product?.name}`} />
                </Col>
                <Col md={6}>
                    <div className={styles.productDetails}>
                        <h3>{product?.name}</h3>
                        <p>{product?.description}</p>
                        <p><strong>Price:</strong> ${product?.price}</p>
                        <p><strong>Stock:</strong> {product?.stock}</p>
                        <input 
                            type="number" 
                            value={quantity} 
                            onChange={handleQuantityChange} 
                            min="1" 
                            max={product?.stock} 
                            className={styles.quantityInput}
                            aria-label="Quantity"
                        />
                        <Button onClick={handleAddToCart} className={styles.buttonAddToCart} aria-label="Add to cart">Add to Cart</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
 };
export default ProductView;
