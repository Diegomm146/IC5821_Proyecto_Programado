import React, { useState, FormEvent } from 'react';
import { Form, Row, Col, Button, FormLabel } from 'react-bootstrap';
import { addProduct } from '../../src/assets/Api'; // Asegúrate de que esta ruta es correcta
import { Product } from '../../src/assets/Classes'; // Asegúrate de que esta ruta es correcta
import styles from "./CreateProduct.module.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const CreateProduct: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imagesURL, setImagesURL] = useState<string[]>([]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const entrepreneurData = localStorage.getItem('userData');
        if (entrepreneurData) {
            const { uid } = JSON.parse(entrepreneurData);
            const numericPrice = parseFloat(price);
            const numericStock = parseInt(stock);
            const newProduct = new Product('', category, description, uid, imagesURL, name, numericPrice, numericStock);
            await addProduct(newProduct);
        }
    };

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length <= 4) {
        const filesArray = Array.from(event.target.files);
        const storage = getStorage();

        const uploadPromises = filesArray.map(file => {
            // Genera un nombre de archivo único utilizando un timestamp
            const fileName = `${Date.now()}-${file.name}`;
            const storageRef = ref(storage, `products/${fileName}`);
            return uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
        });

        try {
            const imageUrls = await Promise.all(uploadPromises);
            setImagesURL(imageUrls);
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    } else {
        alert('Please select up to 4 images.');
    }
};

    return (
        <div className={styles.mainContainerCreateProduct}>
            <Form onSubmit={handleSubmit}>
                <FormLabel><h1 className={styles.titleCreateProduct}>Crear Producto</h1></FormLabel>
                <Row style={{ marginBottom: "5px" }}>
                    <Col md={{ span: 3, offset: 2 }} style={{ border: "1px solid red" }}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Nombre</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={{ span: 3, offset: 2 }} style={{ border: "1px solid red" }}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Categoría</Form.Label>
                            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Default select example">
                                <option>Seleccione una opción</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ marginBottom: "5px" }}>
                    <Col md={{ span: 3, offset: 2 }} style={{ border: "1px solid red" }}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Precio</Form.Label>
                            <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={{ span: 3, offset: 2 }} style={{ border: "1px solid red" }}>
                        <Form.Group>
                            <Form.Label className={styles.formLabelCreateProduct}>Cantidad disponible</Form.Label>
                            <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ marginBottom: "5px" }}>
                    <Col md={{ span: 3, offset: 2 }} style={{ border: "1px solid red" }}>
                        <Form.Group className="mb-3" controlId="ControlTextarea">
                            <Form.Label className={styles.formLabelCreateProduct}>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={{ span: 3, offset: 2 }} style={{ border: "1px solid red" }}>
    <Form.Group className="mb-3" controlId="formImages">
        <Form.Label className={styles.formLabelCreateProduct}>Imágenes (máximo 4)</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} accept="image/*" />
        {imagesURL.length > 0 && (
            <div style={{ marginTop: '10px' }}>
                <strong>Imágenes Cargadas:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {imagesURL.map(url => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                            <img src={url} alt="Uploaded" style={{ width: '100px', height: 'auto' }} />
                        </a>
                    ))}
                </div>
            </div>
        )}
    </Form.Group>
</Col>


                </Row>
                <Button type="submit" className={styles.btnCreateProduct}>Crear</Button>
            </Form>
        </div>
    );
};

export default CreateProduct;
