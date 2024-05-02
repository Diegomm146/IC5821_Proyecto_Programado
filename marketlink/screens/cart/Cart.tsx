import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Cart.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {auth} from "../../src/firebase/firebaseConfig";
import { getCartItems, deleteCartItem } from "../../src/assets/Api";
import { CartItem, CartItemData} from "../../src/assets/Classes";
import { useNavigate } from 'react-router-dom';
  
const Cart: FunctionComponent = () => {
    const [cartItems, setCartItems] = useState<CartItemData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const items = await getCartItems(auth.currentUser?.uid || "");
                console.log("Cart items:", items);
                setCartItems(items);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };
        fetchCartItems();
    }, []);

    const handleDelete = (cartItemId: string) => {
        deleteCartItem(cartItemId).then(() => {
          setCartItems(currentItems => currentItems.filter(item => item.id !== cartItemId));
        });
      };

    const handleCompletePurchase = () => {
        if (cartItems.length === 0 || cartItems.every(item => item.quantity === 0)) {
            alert("Your cart is empty!");
            return;
        }
        navigate('/checkout');
    };
  return (  
    <html>
        <body className={styles.mainContainerCart}>
            <Container>
                <Row>
                    <Col md={{ span: 7, offset: 1 }}>
                        <h1 className={styles.titleCart}>Cart</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 7, offset: 1 }} style={{ paddingBottom: "50px", maxHeight: '700px', overflowY: 'auto' }}>
                        <ListGroup>
                            {cartItems.map((item) => (
                                <CartItemComponent key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={{ span: 3 }}>
                        <h4 className={styles.titleCart}>
                            Subtotal ({cartItems.length} Products): {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                        </h4>
                        <button className={styles.buttonCart} onClick={handleCompletePurchase}>Complete Purchase</button>
                    </Col>
                </Row>
            </Container>
        </body>
    </html>
  );
};


const CartItemComponent: React.FunctionComponent<{ item: CartItemData, onDelete: () => void }> = ({ item, onDelete }) => {
    return (
        <ListGroup.Item>
            <Row style={{ margin: "10px" }}>
                <Col>
                    <img src={item.productImage || "../../../defaultproduct.png"} className={styles.imgProductoCart} alt={item.productName}/>
                </Col>
                <Col>
                    <Row className={styles.textCartItem}>
                        <text>{item.productName}</text>
                    </Row>
                    <Row className={styles.textCartItem}>
                        <text>{item.entrepreneurName}</text>
                    </Row>
                </Col>
                <Col>
                    <Row className={styles.textCartItem}>
                        <text>${item.price.toFixed(2)}</text>
                    </Row>
                    <Row className={styles.textCartItem}>
                        <text>{item.quantity}</text>
                    </Row>
                </Col>
                <Col style={{ alignContent: "center" }}>
                    <a href="#" style={{ margin: "auto" }} onClick={onDelete}>
                        <img src="../../../delete.png" alt="Delete" style={{ width: "25%" }} />
                    </a>
                </Col>
            </Row>
        </ListGroup.Item>
    );
}
export default Cart;
