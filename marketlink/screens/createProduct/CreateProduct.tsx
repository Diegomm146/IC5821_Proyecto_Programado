import React, { useState, FormEvent } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { addProduct } from '../../src/assets/Api';
import { Product } from '../../src/assets/Classes';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./CreateProduct.module.css";
import { toast } from 'react-toastify';

const CreateProduct: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imagesURL, setImagesURL] = useState<string[]>([]);
    const [hasError, setHasError] = useState(false);

    const formatPrice = (input: string) => {
        const numeric = input.replace(/\D/g, '');
        return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handlePriceChange = (e: { target: { value: any; }; }) => {
        setPrice(formatPrice(e.target.value));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!name || !category || !description || !price || !stock || imagesURL.length === 0) {
            setHasError(true);
            return;
        }

        const entrepreneurData = localStorage.getItem('userData');
        if (entrepreneurData) {
            const { uid } = JSON.parse(entrepreneurData);
            const numericPrice = parseFloat(price.replace(/,/g, ''));
            const numericStock = parseInt(stock);
            const newProduct = new Product('', category, description, uid, imagesURL, name, numericPrice, numericStock);
            await addProduct(newProduct);
            toast.success('Product added successfully');
            setHasError(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files).slice(0, 4);
            const storage = getStorage();
    
            const uploadPromises = filesArray.map(file => {
                const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
                return uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
            });
    
            try {
                const urls = await Promise.all(uploadPromises);
                setImagesURL(prevUrls => [...prevUrls, ...urls]);
            } catch (error) {
                
            }
        }
    };

    return (
        <div className={styles.mainContainerCreateProduct}>
            <Form onSubmit={handleSubmit}>
                <h1 className={styles.titleCreateProduct}>Create Product</h1>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={name === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !name}
                                placeholder="Enter product name"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Category</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={category === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !category}

                            >
                                <option>Select an option</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="home-appliances">Home Appliances</option>
                                <option value="books">Books</option>
                                <option value="sports">Sports</option>
                                <option value="beauty-health">Beauty & Health</option>
                                <option value="toys">Toys</option>
                                <option value="food-drink">Food & Drink</option>
                                <option value="automotive">Automotive</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Price</Form.Label>
                            <Form.Control
                                type="text"
                                value={price}
                                onChange={handlePriceChange}
                                className={price === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !price}
                                placeholder="$1,000"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Available Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className={stock === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !stock}
                                placeholder="Enter available quantity"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="ControlTextarea">
                            <Form.Label className={styles.formLabelCreateProduct}>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={description === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !description}
                                placeholder="Enter product description"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="ControlTextarea">
                            <Form.Label className={styles.formLabelCreateProduct}>Images</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                                className={imagesURL.length === 0 && hasError ? "error" : ""}
                                isInvalid={hasError && imagesURL.length === 0}
                                placeholder="Upload product images"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button type="submit" className={styles.btnCreateProduct}>Create</Button>
            </Form>
        </div>
    );
    
};

export default CreateProduct;
