
import { FunctionComponent } from "react";
import styles from "./EditProduct.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel'
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";


const EditProduct: FunctionComponent = () => {
  return (
    <html>
        <body className={styles.mainContainerEditProduct}>
          <FormLabel>
            <h1 className={styles.titleEditProduct}>Editar Producto</h1>
          </FormLabel>
          <Row style={{marginBottom:"5px"}}>
            <Col md={{ span: 3, offset: 2 }}>
                <Form.Group>
                <Form.Label className={styles.formLabelEditProduct}>Nombre</Form.Label>
                <Form.Control type="text"/>
                </Form.Group>
            </Col>
            <Col md={{ span: 3, offset: 2 }}>
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
            <Col md={{ span: 3, offset: 2 }}>
                <Form.Group>
                <Form.Label className={styles.formLabelEditProduct}>Precio</Form.Label>
                <Form.Control type="text"/>
                </Form.Group>       
            </Col>
            <Col md={{ span: 3, offset: 2 }}>
                <Form.Group>
                <Form.Label className={styles.formLabelEditProduct}>Cantidad disponible</Form.Label>
                <Form.Control type="text"/>
                </Form.Group>       
            </Col>
        </Row>
        <Row tyle={{marginBottom:"5px"}}>
            <Col md={{ span: 3, offset: 2 }}>
                <Form.Group className="mb-3" controlId="ControlTextarea">
                    <Form.Label className={styles.formLabelEditProduct}>Descripción</Form.Label>
                    <Form.Control as="textarea" rows={3} className={styles.descripcionCrearProducto}/>
                </Form.Group>
            </Col>
            <Col md={{ span: 3, offset: 2 }}>
                <Form.Group className="mb-5" controlId="ControlTextarea">
                    <Form.Label className={styles.formLabelEditProduct}>Imagenes</Form.Label>
                    <Form.Control type="file"/>
                    <Form.Control type="file"/>
                    <Form.Control type="file"/>
                    <Form.Control type="file"/>
                </Form.Group>            
            </Col>
        </Row>
        <Button className={styles.btnEditProduct}>Guardar</Button>{' '}
        <Button className={styles.btnDeleteEditProduct}>Eliminar</Button>{' '}
        </body>
    </html>
  );
};

export default EditProduct;