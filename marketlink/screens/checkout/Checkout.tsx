import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Checkout.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { redirect, useNavigate } from 'react-router-dom';
import { CartItemData } from "../../src/assets/Classes";
import { getCartItems } from "../../src/assets/Api";
import { toast } from "react-toastify";

const Checkout: FunctionComponent = () => {
    const [cartItems, setCartItems] = useState<CartItemData[]>([]);
    const navigate = useNavigate();
    const [uid, setUid] = useState<string>("");
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user.uid);
            setUid(user.uid);
        } else { 
          redirect("/login");
          return;
        }
    });

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if(uid !== ""){
                    console.log(uid)
                    const items = await getCartItems(uid);
                    setCartItems(items);
                }
            } catch (error) {
                toast.error("Error fetching cart items:" + error);
            }
        };
        fetchCartItems();
    }, [uid]);
    return (
        <html>
            <body className={styles.mainContainerCheckout}>
            <FormLabel>
                <h1 className={styles.titleCheckout}>Complete Purchase</h1>
                <Form.Group className="mb-3" controlId="ControlTextarea">
                    <Form.Label className={styles.formLabelCheckout}>Shipping Specifications</Form.Label>
                    <Form.Control as="textarea" rows={3} className={styles.especificacionesEnvioCheckout}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="ControlTextarea">
                    <Form.Label className={styles.formLabelCheckout}>Total to Pay: <text>###</text></Form.Label>
                </Form.Group>

                <Form.Group className="mb-3" controlId="MetodosPago">
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                            <Form.Label className={styles.formLabelCheckout}> Payment Method: </Form.Label>
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
                                    label="Credit Card"
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
                <Form.Label className={styles.formLabelCheckout}>Name on Card</Form.Label>
                <Form.Control type="text"/>
                </Form.Group>

                <Form.Group>
                <Form.Label className={styles.formLabelCheckout}>Card Number</Form.Label>
                <Form.Control type="number"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="creditCardInfo">
                    <div className="row">
                        <div className="col">
                            <Form.Label className={styles.formLabelCheckout}>CVV</Form.Label>
                            <Form.Control type="number"/>
                        </div>
                        <div className="col">
                            <Form.Label className={styles.formLabelCheckout}>Expiration Date</Form.Label>
                            <Form.Control type="date" />
                        </div>
                    </div>
                </Form.Group>

                <Button className={styles.buttonCheckout}>Complete Order</Button>{' '}
            </FormLabel>
            </body>
        </html>
    );
};

export default Checkout;
