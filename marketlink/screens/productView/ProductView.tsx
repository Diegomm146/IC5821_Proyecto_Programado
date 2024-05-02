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
                .catch(error => {
                    console.error("Error fetching product:", error);
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
        <html>
            <body className={styles.mainContainerProductView}>
                <Container style={{margin:"auto", paddingTop:"100px"}}>
                    <Row>
                        <Col md={2}>
                                <Row >
                                    <Image src={'../../defaultproduct.png'} rounded className={styles.imgProductView}/>
                                </Row> 
                        </Col>
                        <Col md={5}>
                            <Image src={'../../defaultproduct.png'} rounded  className={styles.mainImgProductView}/>
                        </Col>
                        <Col md={4}>
                            <Row style={{padding:"25px 10px 20px"}}>
                                <text className={styles.descriptionProductView}>
                                    {product?.name}
                                </text>
                            </Row>
                            <Row style={{padding:"0px 10px 20px"}}>
                                <text className={styles.descriptionProductView}>
                                    emprendedor
                                </text>
                            </Row> 
                            <Row style={{padding:"0px 10px 20px"}}>
                                <text className={styles.descriptionProductView}>
                                    Precio: {product?.price} $
                                </text>
                            </Row> 
                            <Row style={{padding:"0px 10px 20px"}}>
                                <text className={styles.descriptionProductView}>
                                    Available: {product?.stock}
                                </text>
                            </Row> 
                            <Row style={{padding:"0px 10px 20px"}}> 
                                <text className={styles.descriptionProductView}>
                                    {product?.description}
                                </text>
                            </Row> 
                        </Col>
                    </Row>
                    <Row style={{paddingTop:"20px"}}>
                        <Col md={{ span: 2, offset: 4 }}>
                            <input type="number" value={quantity} onChange={handleQuantityChange} min="1" placeholder="Cantidad" className={styles.cantidadProductView}/>
                        </Col>
                        <Col md={2}>
                            <Button className={styles.buttonProductView} onClick={handleAddToCart}>Agregar al carrito</Button>
                        </Col>
                    </Row>
                </Container>
            </body>
        </html>
  );
};

export default ProductView;
