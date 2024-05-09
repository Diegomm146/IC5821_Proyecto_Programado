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
import { Table } from "react-bootstrap";

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

    useEffect(() => {
        const fetchOrders = async () => {
            if (uid !== "") {
                try {
                    const items = await getOrders(uid);
                    
                    setOrders(items);
                } catch (error) {
                    toast.error("Error fetching orders ");
                }
            }
        };

        fetchOrders();
    }, [uid]);  

    return (
        <Container className={styles.mainContainerClientOrders}>
            <Row>
                <h1 className={styles.titleClientOrders}>Orders Placed</h1>
            </Row>
            <Row>
                <Col md={{ span: 10, offset: 1 }} style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Entrepreneur</th>
                                <th>Paid</th>
                                <th>Quantity</th>
                                <th>Shipping Details</th>
                                <th>Date Completed</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td><img src={order.productImage || "../../../defaultproduct.png"} alt="Product" className={styles.imgProductoClientOrders} /></td>
                                    <td>{order.productName}</td>
                                    <td>{order.entrepreneurName}</td>
                                    <td>${order.amountPaid}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.shippingDetails}</td>
                                    <td>{order.dateCompleted}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};
export default ClientOrders;
