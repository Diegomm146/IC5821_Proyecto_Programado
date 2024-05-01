
import { FunctionComponent } from "react";
import styles from "./CreateProduct.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel'
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";


const CreateProduct: FunctionComponent = () => {
  return (
    <html>
        <body className={styles.mainContainerCreateProduct}>
          <FormLabel>
            <h1 className={styles.titleCreateProduct}>Crear Producto</h1>
          </FormLabel>
          <Row style={{marginBottom:"5px"}}>
            <Col md={{ span: 3, offset: 2 }} style={{border:"1px solid red"}}>
                <Form.Group>
                <Form.Label className={styles.formLabelCreateProduct}>Nombre</Form.Label>
                <Form.Control type="text"/>
                </Form.Group>
            </Col>
            <Col md={{ span: 3, offset: 2 }} style={{border:"1px solid red"}}>
                <Form.Group >
                <Form.Label className={styles.formLabelCreateProduct}>Categoria</Form.Label>
                <Form.Select aria-label="Default select example">
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                </Form.Select>
                </Form.Group>            
            </Col>
        </Row>
        <Row tyle={{marginBottom:"5px"}}> 
            <Col md={{ span: 3, offset: 2 }} style={{border:"1px solid red"}}>
                <Form.Group>
                <Form.Label className={styles.formLabelCreateProduct}>Precio</Form.Label>
                <Form.Control type="text"/>
                </Form.Group>       
            </Col>
            <Col md={{ span: 3, offset: 2 }} style={{border:"1px solid red"}}>
                <Form.Group>
                <Form.Label className={styles.formLabelCreateProduct}>Cantidad disponible</Form.Label>
                <Form.Control type="text"/>
                </Form.Group>       
            </Col>
        </Row>
        <Row tyle={{marginBottom:"5px"}}>
            <Col md={{ span: 3, offset: 2 }} style={{border:"1px solid red"}}>
                <Form.Group className="mb-3" controlId="ControlTextarea">
                    <Form.Label className={styles.formLabelCreateProduct}>Descripción</Form.Label>
                    <Form.Control as="textarea" rows={3} className={styles.descripcionCrearProducto}/>
                </Form.Group>
            </Col>
            <Col md={{ span: 3, offset: 2 }} style={{border:"1px solid red"}}>
                <Form.Group className="mb-3" controlId="ControlTextarea">
                    <Form.Label className={styles.formLabelCreateProduct}>Imagenes</Form.Label>
                    <Form.Control type="file"/>
                    <Form.Control type="file"/>
                    <Form.Control type="file"/>
                    <Form.Control type="file"/>
                </Form.Group>            
            </Col>
        </Row>
        <Button className={styles.btnCreateProduct}>Crear</Button>{' '}
        </body>
    </html>
  );
};

export default CreateProduct;