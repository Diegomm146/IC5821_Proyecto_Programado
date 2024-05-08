import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Stack } from "react-bootstrap";
import styles from "./EntrepreneurOrders.module.css";
import { EntrepreneurOrder } from "../../src/assets/Classes";
import { getEntrepreneurOrders, updateEntrepreneurOrderStatus } from "../../src/assets/Api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EntrepreneurOrders = () => {
  const [orders, setOrders] = useState<EntrepreneurOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<EntrepreneurOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 
  const [uid, setUid] = useState<string>("");


  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
            setUid(user.uid);
        } else {
            
        }
    });

    return () => unsubscribe();  
  }, [auth, navigate]);  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
          const fetchedOrders = await getEntrepreneurOrders(uid);
          
          setOrders(fetchedOrders);
      } catch (error) {
          console.error("Failed to fetch orders:", error);
      }
  };
  fetchOrders();
  }, [uid]);



  const handleShowModal = (order: EntrepreneurOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <Container className={styles.mainContainerEntrepreneurOrders}>
      <Row className="mb-4">
        <h1 className={styles.titleEntrepreneurOrders}>Orders</h1>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }} style={{ maxHeight: '700px', overflowY: 'auto' }}>
          <Table bordered responsive striped>
            <thead>
              <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Product</th>
                <th>Shipping Specs</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr>
                  <td>{order.clientEmail}</td>
                  <td>{order.date.toString()}</td>
                  <td>{order.amount}</td>
                  <td>{order.product}</td>
                  <td>{order.shippingSpecs}</td>
                  <td>{order.status}</td>
                  <td>
                    <Button
                      style={{ color: "#83AF4B", backgroundColor: "transparent", border: "5px solid #83AF4B" }}
                      className={styles.btnEntrepreneurOrders}
                      onClick={() => handleShowModal(order)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      {selectedOrder && (
        <OrderDetails
          show={showModal}
          onHide={handleCloseModal}
          order={selectedOrder}
        />
      )}
    </Container>
  );
};

const OrderDetails = ({ show, onHide, order }) => {
  const handleCompletePurchase = async () => {
    try {
        
        await updateEntrepreneurOrderStatus(order.transactionItemId, "Completed");
        toast.success('Order status updated to "Completed"');
        onHide(); 
    } catch (error) {
        toast.error("Failed to complete the order. Please try again.");
        console.error('Error completing order:', error);
    }
  };
  const handleCancelPurchase = async () => {
    try {
        
        await updateEntrepreneurOrderStatus(order.transactionItemId, "Canceled"); 
        toast.success('Order status updated to "Canceled"');
        onHide(); 
    } catch (error) {
        toast.error("Failed to cancel the order. Please try again.");
        console.error('Error canceling order:', error);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details: </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={3}>
          <div><strong>Client:</strong> {order.clientEmail}</div>
          <div><strong>Date:</strong> {order.date}</div>
          <div><strong>Amount:</strong> {order.amount}</div>
          <div><strong>Product:</strong> {order.product}</div>
          <div><strong>Shipping Specs:</strong> {order.shippingSpecs}</div>
          <div><strong>Status:</strong> {order.status}</div>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCancelPurchase}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleCompletePurchase}>
          Complete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EntrepreneurOrders;
