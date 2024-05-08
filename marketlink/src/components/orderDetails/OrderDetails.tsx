import React from 'react';
import { Button, Modal, Stack } from 'react-bootstrap';

interface Order {
    id: string;
    clientName: string;
    clientEmail: string;
    date: string;
    amount: number;
    invoiceId: string;
    productName: string;
    shippingSpecs: string[];
}
  
interface OrderDetailsProps {
    show: boolean;
    onHide: () => void;
    order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ show, onHide, order }) => {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order: {order.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <div><strong>Client:</strong> {order.clientName} <br/> {order.clientEmail}</div>
            <div><strong>Date:</strong> {order.date}</div>
            <div><strong>Amount:</strong> ${order.amount.toFixed(2)}</div>
            <div><strong>Invoice ID:</strong> {order.invoiceId}</div>
            <div><strong>Product:</strong> {order.productName}</div>
            <div>
              <strong>Shipping Specifications:</strong>
              <ul>
                {order.shippingSpecs.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="success" onClick={() => console.log('Completing order...')}>Complete</Button>
        </Modal.Footer>
      </Modal>
    );
};
  
export default OrderDetails;
