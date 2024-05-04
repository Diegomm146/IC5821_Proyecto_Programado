import React, { useState, FormEvent } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { addProduct } from '../../src/assets/Api';
import { Product } from '../../src/assets/Classes';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./CreateProduct.module.css";

const CreateProduct: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imagesURL, setImagesURL] = useState<string[]>([]);
    const [hasError, setHasError] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!name || !category || !description || !price || !stock || imagesURL.length === 0) {
            setHasError(true);
            return;
        }

        const entrepreneurData = localStorage.getItem('userData');
        if (entrepreneurData) {
            const { uid } = JSON.parse(entrepreneurData);
            const numericPrice = parseFloat(price);
            const numericStock = parseInt(stock);
            const newProduct = new Product('', category, description, uid, imagesURL, name, numericPrice, numericStock);
            await addProduct(newProduct);
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
                console.error("Error uploading files:", error);
            }
        }
    };

    return (
        <div className={styles.mainContainerCreateProduct}>
            <Form onSubmit={handleSubmit}>
                <h1 className={styles.titleCreateProduct}>Crear Producto</h1>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={name === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !name}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Categoría</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={category === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !category}
                            >
                                <option>Seleccione una opción</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className={price === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !price}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Cantidad disponible</Form.Label>
                            <Form.Control
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className={stock === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !stock}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="ControlTextarea">
                            <Form.Label className={styles.formLabelCreateProduct}>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={description === "" && hasError ? "error" : ""}
                                isInvalid={hasError && !description}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="ControlTextarea">
                            <Form.Label className={styles.formLabelCreateProduct}>Imágenes</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                                className={imagesURL.length === 0 && hasError ? "error" : ""}
                                isInvalid={hasError && imagesURL.length === 0}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button type="submit" className={styles.btnCreateProduct}>Crear</Button>
            </Form>
        </div>
    );
};

export default CreateProduct;
