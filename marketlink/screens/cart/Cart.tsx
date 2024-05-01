import { FunctionComponent } from "react";
import styles from "./Cart.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Cart: FunctionComponent = () => {
  return (  
    <html>
        <body className={styles.mainContainerCart}>
        <Container>
            <Row>
                <Col md={{ span: 7, offset: 1 }}>
                    <h1 className={styles.titleCart}>Cart</h1>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 7, offset: 1 }} style={{maxHeight: '700px', overflowY: 'auto'}}>
                    <ListGroup>
                        <CartItem />
                    </ListGroup>
                </Col>
                <Col md={{ span: 3}}>
                    <h4 className={styles.titleCart}>
                        Subtotal (X Products): ####
                    </h4>
                    <button className={styles.buttonCart}>Complete Purchase</button>
                </Col>
            </Row>
        </Container>
        </body>
    </html>
  );
};

const CartItem: FunctionComponent = () => {
    return (
        <ListGroup.Item>
            <Row style={{margin:"10px"}}>
                <Col>
                    <img src="../../../defaultproduct.png" className={styles.imgProductoCart}/>
                </Col>
                <Col>
                    <Row className={styles.textCartItem}>
                        <text>
                            Product Name
                        </text>
                    </Row>
                    <Row className={styles.textCartItem}>
                        <text>
                            Entrepreneur Name
                        </text>
                    </Row>
                </Col>
                <Col >
                    <Row className={styles.textCartItem}>
                        <text>
                            Price
                        </text>
                    </Row>
                    <Row className={styles.textCartItem}>
                        <text>
                            Quantity
                        </text>
                    </Row>
                </Col>
                <Col style={{alignContent:"center"}} > 
                    <a href="#" style={{ margin: "auto" }}>
                        <img src="../../../delete.png" alt="logo" style={{width:"25%"}} />
                    </a>
                </Col>
            </Row>
        </ListGroup.Item>
    );
}
export default Cart;
