import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Cart.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getCartItems, deleteCartItem, checkItemAvailability } from "../../src/assets/Api";
import { CartItem, CartItemData } from "../../src/assets/Classes";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Cart: FunctionComponent = () => {
    const [cartItems, setCartItems] = useState<CartItemData[]>([]);
    const navigate = useNavigate();
    const [uid, setUid] = useState<string>("");
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                navigate("/login");
            }
        });
    }, [auth, navigate]);

    useEffect(() => {
        const fetchCartItems = async () => {
            if(uid !== ""){
                try {
                    const items = await getCartItems(uid);
                    setCartItems(items);
                } catch (error) {
                    toast.error("Error fetching cart items: " + error.message);
                }
            }
        };
        fetchCartItems();
    }, [uid]);

    const handleDelete = async (cartItemId: string) => {
        try {
            await deleteCartItem(cartItemId);
            setCartItems(currentItems => currentItems.filter(item => item.id !== cartItemId));
        } catch (error) {
            toast.error("Failed to delete item: " + error.message);
        }
    };

    const handleCompletePurchase = async () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        try {
            const results = await Promise.all(
                cartItems.map(item => checkItemAvailability(item.id, item.quantity))
            );

            if (results.every(result => result)) {
                navigate('/checkout');
            } else {
                toast.error("Some items are no longer available.");
            }
        } catch (error) {
            toast.error("Failed to complete purchase: " + error.message);
        }
    };

    return (
        <Container className={styles.mainContainerCart}>
            <h1 className={styles.titleCart}>Cart</h1>
            <ListGroup>
                {cartItems.map((item) => (
                    <CartItemComponent key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
                ))}
            </ListGroup>
            {cartItems.length > 0 && (
                <div>
                    <h4>
                        Subtotal ({cartItems.length} Products): ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                    </h4>
                    <Button className={styles.buttonCart} onClick={handleCompletePurchase}>Complete Purchase</Button>
                </div>
            )}
        </Container>
    );
};

const CartItemComponent: React.FunctionComponent<{ item: CartItemData, onDelete: () => void }> = ({ item, onDelete }) => {
    return (
        <ListGroup.Item className={styles.cartItem}>
            <Row>
                <Col xs={3}><img src={item.productImage || "../../../defaultproduct.png"} className={styles.imgProductoCart} alt={item.productName}/></Col>
                <Col>
                    <div className={styles.textCartItem}>{item.productName}</div>
                    <div className={styles.textCartItem}>{item.entrepreneurName}</div>
                    <div className={styles.textCartItem}>${item.price.toFixed(2)}</div>
                    <div className={styles.textCartItem}>Qty: {item.quantity}</div>
                </Col>
                <Col xs={1}>
                    <Button variant="link" onClick={onDelete} className={styles.deleteButton}><img src="../../../delete.png" alt="Delete" /></Button>
                </Col>
            </Row>
        </ListGroup.Item>
    );
};

export default Cart;
