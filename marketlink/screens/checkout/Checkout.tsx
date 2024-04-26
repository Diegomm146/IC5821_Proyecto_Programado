
import { FunctionComponent } from "react";
import styles from "./Checkout.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel'


const Checkout: FunctionComponent = () => {
  return (
    <html>
        <body className={styles.mainContainerCheckout}>
          <FormLabel>
            <h1 className={styles.titleCheckout}>Finalizar Compra</h1>
            <Form.Group className="mb-3" controlId="ControlTextarea">
                <Form.Label className={styles.formLabelCheckout}>Especificaciones de envió</Form.Label>
                <Form.Control as="textarea" rows={3} className={styles.especificacionesEnvioCheckout}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="ControlTextarea">
                <Form.Label className={styles.formLabelCheckout}>Total a Pagar: <text>###</text></Form.Label>
            </Form.Group>

            <Form.Group className="mb-3" controlId="MetodosPago">
                {['radio'].map((type) => (
                    <div key={`inline-${type}`} className="mb-3">
                        <Form.Label className={styles.formLabelCheckout}> Método de Pago: </Form.Label>
                        <div style={{ marginTop: "5px" }}>
                            <Form.Check
                                inline
                                label="Sinpe"
                                name="group1"
                                id={`metodoPago-Sinpe`}
                                type="radio"
                            />
                            <Form.Check
                                inline
                                label="Tarjeta"
                                name="group1"
                                id={`metodoPago-Tarjeta`}
                                type="radio"
                            />
                            <Form.Check
                                inline
                                label="PayPal"
                                name="group1"
                                id={`metodoPago-Paypal`}
                                type="radio"
                            />
                        </div>
                    </div>
                ))}
            </Form.Group>
            
            <Form.Group>
              <Form.Label className={styles.formLabelCheckout}>Nombre en tarjeta</Form.Label>
              <Form.Control type="text"/>
            </Form.Group>

            <Form.Group>
              <Form.Label className={styles.formLabelCheckout}>Número de Tarjeta</Form.Label>
              <Form.Control type="number"/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="creditCardInfo">
                <div className="row">
                    <div className="col">
                        <Form.Label className={styles.formLabelCheckout}>CVV</Form.Label>
                        <Form.Control type="number"/>
                    </div>
                    <div className="col">
                        <Form.Label className={styles.formLabelCheckout}>Fecha de Vencimiento</Form.Label>
                        <Form.Control type="date" />
                    </div>
                </div>
            </Form.Group>

            <Button className={styles.buttonCheckout}>Completar Pedido</Button>{' '}
          </FormLabel>
        </body>
    </html>
  );
};

export default Checkout;