import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Checkout.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { redirect, useNavigate } from 'react-router-dom';
import { CartItemData } from "../../src/assets/Classes";
import { getCartItems, deleteCartItems } from "../../src/assets/Api";
import { toast } from "react-toastify";
import { addDoc, collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../../src/firebase/firebaseConfig";

const Checkout: FunctionComponent = () => {
    const [cartItems, setCartItems] = useState<CartItemData[]>([]);
    const navigate = useNavigate();
    const [uid, setUid] = useState<string>("");
    const auth = getAuth();
    const [total, setTotal] = useState<number>(0);

    const [shippingDetails, setShippingDetails] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');


    // Effect for handling authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUid(user.uid);
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();  
    }, [auth, navigate]);  

    useEffect(() => {
        const fetchCartItems = async () => {
            if (uid !== "") {
                try {
                    const items = await getCartItems(uid);
                    setTotal(items.reduce((acc, item) => acc + item.price, 0));
                    setCartItems(items);
                } catch (error) {
                    toast.error("Error fetching cart items: " + error.message);
                }
            }
        };

        fetchCartItems();
    }, [uid]);  

    const handleSubmit = async () => {

        const transactionRef = collection(db, "Transaction");
        const transactionItemsRef = collection(db, "TransactionItem");

        try {
            const transactionDoc = await addDoc(transactionRef, {
                paymentMethod: paymentMethod,
                shippingDetails: shippingDetails,
                totalPaid: total,
                transactionDate: new Date().toISOString(),
                user: doc(db, "User", uid)
            });
            console.log(transactionDoc);

            // Create transaction items for each cart item
            const batch = writeBatch(db);
            cartItems.forEach(item => {
                const docRef = doc(transactionItemsRef);
                batch.set(docRef, {
                    priceAtPurchase: item.price,
                    product: doc(db, "Product", item.productId),
                    quantity: item.quantity,
                    transaction: transactionDoc
                });
            });

            await batch.commit();
            console.log("Transaction items created successfully!");
            await deleteCartItems(uid);
            console.log("Purchase completed successfully!")
            toast.success("Purchase completed successfully!");
            setTimeout(() => {
                navigate("/client-profile"); 
            }, 2000);

        } catch (error) {
            toast.error("Error completing purchase: " + error.message);
        }
    };

    return (
        <html>
            <body className={styles.mainContainerCheckout}>
            <Form >
                <FormLabel >
                    <h1 className={styles.titleCheckout}>Complete Purchase</h1>
                    <Form.Group className="mb-3" controlId="ControlTextarea">
                        <Form.Label className={styles.formLabelCheckout}>Shipping Specifications</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            className={styles.especificacionesEnvioCheckout}
                            onChange={(e) => setShippingDetails(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ControlTextarea">
                        <Form.Label className={styles.formLabelCheckout}>Total to Pay: $<text>{total}</text></Form.Label>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="MetodosPago">
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`} className="mb-3">
                                <Form.Label className={styles.formLabelCheckout}> Payment Method: </Form.Label>
                                <div style={{ marginTop: "5px" }}>
                                    <Form.Check
                                        inline
                                        label="Sinpe"
                                        name="paymentMethod"
                                        type="radio"
                                        id="paymentMethod1"
                                        onChange={() => setPaymentMethod('Sinpe')}
                                    />
                                    <Form.Check
                                        inline
                                        label="Credit Card"
                                        name="paymentMethod"
                                        type="radio"
                                        id="paymentMethod2"
                                        onChange={() => setPaymentMethod('Credit Card')}
                                    />
                                    <Form.Check
                                        inline
                                        label="PayPal"
                                        name="paymentMethod"
                                        type="radio"
                                        id="paymentMethod3"
                                        onChange={() => setPaymentMethod('PayPal')}
                                    />
                                </div>
                            </div>
                        ))}
                    </Form.Group>
                    
                    <Form.Group>
                    <Form.Label className={styles.formLabelCheckout}>Name on Card</Form.Label>
                    <Form.Control
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                    />
                    </Form.Group>

                    <Form.Group>
                    <Form.Label className={styles.formLabelCheckout}>Card Number</Form.Label>
                    <Form.Control
                        type="number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="creditCardInfo">
                        <div className="row">
                            <div className="col">
                                <Form.Label className={styles.formLabelCheckout}>CVV</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                />
                            </div>
                            <div className="col">
                                <Form.Label className={styles.formLabelCheckout}>Expiration Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </Form.Group>
                    <Button onClick={handleSubmit} className={styles.buttonCheckout}>Complete Order</Button>{' '}
                </FormLabel>
            </Form>
            </body>
        </html>
    );
};

export default Checkout;
