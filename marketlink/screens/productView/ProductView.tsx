import { FunctionComponent } from "react";
import styles from "./ProductView.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const ProductView: FunctionComponent = () => {
  return (
    <html>
        <body className={styles.mainContainerProductView}>
            <Container style={{margin:"auto", paddingTop:"100px"}}>
                <Row>
                    <Col  md={2}>
                        <Row>
                            <Image src="../../defaultproduct.png" rounded className={styles.imgProductView}/>
                        </Row>
                        <Row>
                            <Image src="../../defaultproduct.png" rounded className={styles.imgProductView}/>
                        </Row> 
                        <Row>
                            <Image src="../../defaultproduct.png" rounded className={styles.imgProductView}/>
                        </Row> 
                        <Row>
                            <Image src="../../defaultproduct.png" rounded className={styles.imgProductView}/>
                        </Row> 
                    </Col>
                    <Col md={5}>
                        <Image src="../../defaultproduct.png" rounded  className={styles.mainImgProductView}/>
                    </Col>
                    <Col  md={4}>
                        <Row style={{padding:"25px 10px 20px"}}>
                            <text className={styles.descriptionProductView}>
                                Nombre del producto
                            </text>
                        </Row>
                        <Row style={{padding:"0px 10px 20px"}}>
                            <text className={styles.descriptionProductView}>
                                Nombre del emprendedor
                            </text>
                        </Row> 
                        <Row style={{padding:"0px 10px 20px"}}>
                            <text className={styles.descriptionProductView}>
                                Precio: ## 
                            </text>
                        </Row> 
                        <Row style={{padding:"0px 10px 20px"}}>
                            <text className={styles.descriptionProductView}>
                                Disponibles: ## 
                            </text>
                        </Row> 
                        <Row style={{padding:"0px 10px 20px"}}> 
                            <text className={styles.descriptionProductView}>
                                Descripción del producto 
                            </text>
                        </Row> 
                    </Col>
                </Row>
                <Row style={{paddingTop:"20px"}}>
                    <Col md={{ span: 2, offset: 4 }}>
                         <input type="number" id="quantity" name="quantity" min="1" placeholder="Cantidad" className={styles.cantidadProductView}/>
                    </Col>
                    <Col md={2}>
                        <button className={styles.buttonProductView}>Agregar al carrito</button>
                    </Col>
                </Row>
            </Container>
        </body>
    </html>
  );
};

export default ProductView;
