import { FunctionComponent } from "react";
import styles from "./ClientOrders.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ClientOrders: FunctionComponent = () => {
  return (
    <html>
        <body className={styles.mainContainerClientOrders}>
        <Container>
            <Row>
                <h1 className={styles.titleClientOrders}>Pedidos realizados</h1>
            </Row>
            <Row>
                <Col md={{ span: 10, offset: 1 }} style={{maxHeight: '700px', overflowY: 'auto'}}>
                    <ListGroup>
                        <Order />
                        <Order />
                        <Order />
                    </ListGroup>
                </Col>
            </Row>
        </Container>
        </body>
    </html>
  );
};

const Order: FunctionComponent = () => {
    return (
        <ListGroup.Item>
            <Row style={{margin:"10px"}}>
                <Col>
                    <img src="../../../defaultproduct.png" className={styles.imgProductoClientOrders}/>
                </Col>
                <Col>
                    <Row className={styles.textClientOrders}>
                        <text>
                            Nombre Producto
                        </text>
                    </Row>
                    <Row className={styles.textClientOrders}>
                        <text>
                            Nombre Emprendedor
                        </text>
                    </Row>
                </Col>
                <Col >
                    <Row className={styles.textClientOrders}>
                        <text>
                            Pagado
                        </text>
                    </Row>
                    <Row className={styles.textClientOrders}>
                        <text>
                            Cantidad
                        </text>
                    </Row>
                </Col>
                <Col>
                    <Row className={styles.bigTextClientOrders}>
                        <text>
                            Especificaciones Envio
                        </text>
                    </Row>
                </Col>
                <Col>
                    <Row className={styles.textClientOrders}>
                        <text>
                            Fecha Realizado
                        </text>
                    </Row>
                    <Row className={styles.textClientOrders}>
                        <text>
                            Fecha Completado
                        </text>
                    </Row>
                </Col>
                <Col>
                    <Row className={styles.textClientOrders}>
                        <text>
                            Estado
                        </text>
                    </Row>            
                </Col>
            </Row>
        </ListGroup.Item>
    )
}
export default ClientOrders;
