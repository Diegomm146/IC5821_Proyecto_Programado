import { FunctionComponent, useEffect, useState } from "react";
import styles from "./ClientOrders.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getOrders } from "../../src/assets/Api";
import { toast } from "react-toastify";

const ClientOrders: FunctionComponent = () => {
    const navigate = useNavigate();
    const [uid, setUid] = useState<string>("");
    const auth = getAuth();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUid(user.uid);
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();  
    }, [auth, navigate]);  

    useEffect(() => {
        const fetchOrders = async () => {
            if (uid !== "") {
                try {
                    const items = await getOrders(uid);
                    
                    setOrders(items);
                } catch (error: any) {
                    toast.error("Error fetching orders: " + error.message);
                }
            }
        };

        fetchOrders();
    }, [uid]);  

    return (
        <html>
            <body className={styles.mainContainerClientOrders}>
                <Container>
                    <Row>
                        <h1 className={styles.titleClientOrders}>Orders Placed</h1>
                    </Row>
                    <Row>
                        <Col md={{ span: 10, offset: 1 }} style={{ maxHeight: '700px', overflowY: 'auto' }}>
                            <ListGroup>
                                {orders.map((order, index) => (
                                    <OrderComponent key={index} order={order} />
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </body>
        </html>
    );
};

const OrderComponent: FunctionComponent<{ order: any }> = ({ order }) => {
    console.log(order);
    return (
        <ListGroup.Item>
            <Row style={{margin:"10px"}}>
                <Col>
                    <img src={order.productImage || "../../../defaultproduct.png"} className={styles.imgProductoClientOrders} />
                </Col>
                <Col>
                    <Row className={styles.textClientOrders}>
                        <text>Product: {order.productName}</text>
                    </Row>
                    <Row className={styles.textClientOrders}>
                        <text>
                            <text>Entrepreneur: {order.entrepreneurName}</text>
                        </text>
                    </Row>
                </Col>
                <Col >
                    <Row className={styles.textClientOrders}>
                        <text>Paid: ${order.amoutPaid}</text>
                    </Row>
                    <Row className={styles.textClientOrders}>
                        <text>Quantity: {order.quantity}</text>
                    </Row>
                </Col>
                <Col>
                    <Row className={styles.bigTextClientOrders}>
                        <text>Shipping Specifications: {order.shippingDetails}</text>
                    </Row>
                </Col>
                <Col>
                    <Row className={styles.textClientOrders}>
                        <text>
                        <text>Date: {order.dateCompleted}</text>
                        </text>
                    </Row>
                    <Row className={styles.textClientOrders}>
                        <text>Payment Method: {order.paymentMethod}</text>
                    </Row>
                </Col>
                <Col>
                    <Row className={styles.bigTextClientOrders}>
                        <text>Status: {order.status}</text>
                    </Row>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}
export default ClientOrders;
