import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Stack } from "react-bootstrap";
import styles from "./EntrepreneurOrders.module.css";
import { Order as OrderType } from "../../src/assets/Classes";
import { getOrders } from "../../src/assets/Api";

const EntrepreneurOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("Fetching orders...");
      const entrepreneurData = localStorage.getItem("userData");

      if (entrepreneurData) {
        const { uid } = JSON.parse(entrepreneurData);
        if (uid) {
          try {
            const fetchedOrders = await getOrders(uid);
            setOrders(fetchedOrders);
          } catch (error) {
            console.error("Failed to fetch orders:", error);
          }
        } else {
          console.log("No UID found in entrepreneur data.");
        }
      } else {
        console.log("No entrepreneur data found in local storage.");
      }
    };

    fetchOrders();
  }, []);

  const handleShowModal = (order: OrderType) => {
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
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Invoice ID</th>
                <th>Product</th>
                <th>Shipping Specs</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.dateCompleted}</td>
                  <td>${order.quantity}</td>
                  <td>{order.productName}</td>
                  <td>{order.shippingDetails}</td>
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
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details: {order.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={3}>
          <div><strong>Client:</strong> {order.clientName}</div>
          <div><strong>Date:</strong> {order.date}</div>
          <div><strong>Amount:</strong> ${order.amount.toFixed(2)}</div>
          <div><strong>Invoice ID:</strong> {order.invoiceId}</div>
          <div><strong>Product:</strong> {order.productName}</div>
          <div>
            <strong>Shipping Specs:</strong>
            <ul>
              {order.shippingSpecs.map((spec, index) => <li key={index}>{spec}</li>)}
            </ul>
          </div>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="success" onClick={() => console.log('Completing order...')}>
          Complete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EntrepreneurOrders;
