import { FunctionComponent, useState } from "react";
import styles from "./EntrepreneurOrders.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { Button, Modal, Stack } from "react-bootstrap";

const EntrepreneurOrders: FunctionComponent = () => {
  return (
    <html>
        <body className={styles.mainContainerEntrepreneurOrders}>
        <Container>
            <Row className="mb-4">
                <h1 className={styles.titleEntrepreneurOrders}>Pedidos</h1>
            </Row>
            <Row>
                <Col md={{ span: 10, offset: 1 }} style={{maxHeight: '700px', overflowY: 'auto'}}>
                <Table bordered responsive striped>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Monto</th>
                        <th>ID de factura</th>
                        <th>Producto</th>
                        <th>Especificaciones de envió</th>
                        <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Order />
                        <Order />
                        <Order />
                        <Order />
                    </tbody>
                </Table>
                </Col>
            </Row>
        </Container>
        </body>
    </html>
  );
};

const Order: FunctionComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const currentOrder = {
        id: "12345",
        clientName: "Nombre del Cliente",
        clientEmail: "correo@cliente.com",
        date: "DD/MM/YYYY",
        amount: 123.45,
        invoiceId: "INV123456",
        productName: "Nombre del producto",
        shippingSpecs: [
          "Especificación 1",
          "Especificación 2",
          "Especificación 3"
        ]
      };
    return (
        <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <button 
            style={{color:"#83AF4B", backgroundColor:"transparent", border:"5px solid #83AF4B"}} 
            className={styles.btnEntrepreneurOrders} 
            onClick={() => setShowModal(true)}
            >
            Ver
            </button>
            <OrderDetails
            show={showModal}
            onHide={() => setShowModal(false)}
            order={currentOrder}  
            />
        </tr>
    )
}

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

const OrderDetails: React.FunctionComponent<OrderDetailsProps> = ({ show, onHide, order }) => {
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

export default EntrepreneurOrders;
