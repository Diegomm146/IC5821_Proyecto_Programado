import { FunctionComponent, useEffect, useState } from "react";
import styles from "./ClientOrders.module.css";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getOrders } from "../../src/assets/Api";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import { useHighContrast } from "../../src/assets/HighContrastContext.tsx";

const ClientOrders: FunctionComponent = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState<string>("");
  const auth = getAuth();
  const [orders, setOrders] = useState<any[]>([]);

  const { isHighContrast } = useHighContrast();

  const homeClass = isHighContrast
    ? `${styles.home} ${styles.highContrast}`
    : styles.home;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
    <div className={homeClass}>
      <Container className={styles.mainContainerClientOrders}>
        <Row>
          <h1 className={styles.titleClientOrders}>Orders Placed</h1>
        </Row>
        <Row>
          <Col
            md={{ span: 10, offset: 1 }}
            style={{ maxHeight: "700px", overflowY: "auto" }}
          >
            <Table striped bordered hover responsive>
              <caption>Orders Placed by the Client</caption>
              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Product</th>
                  <th scope="col">Entrepreneur</th>
                  <th scope="col">Paid</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Shipping Details</th>
                  <th scope="col">Date Completed</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          order.productImage || "../../../defaultproduct.png"
                        }
                        alt="Product"
                        className={styles.imgProductoClientOrders}
                      />
                    </td>
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
    </div>
  );
};
export default ClientOrders;
