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
          <Modal.Title>Pedido: {order.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <div><strong>Cliente:</strong> {order.clientName} <br/> {order.clientEmail}</div>
            <div><strong>Fecha:</strong> {order.date}</div>
            <div><strong>Monto:</strong> ${order.amount.toFixed(2)}</div>
            <div><strong>ID de Factura:</strong> {order.invoiceId}</div>
            <div><strong>Producto:</strong> {order.productName}</div>
            <div>
              <strong>Especificaciones de envío:</strong>
              <ul>
                {order.shippingSpecs.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button variant="success" onClick={() => console.log('Completing order...')}>Completar</Button>
        </Modal.Footer>
      </Modal>
    );
};
  
export default OrderDetails;