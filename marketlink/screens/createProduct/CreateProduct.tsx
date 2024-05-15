import React, { useState, FormEvent } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { addProduct } from "../../src/assets/Api";
import { Product } from "../../src/assets/Classes";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./CreateProduct.module.css";
import { toast } from "react-toastify";
import { useHighContrast } from "../../src/assets/HighContrastContext.tsx";

const CreateProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imagesURL, setImagesURL] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);

  const { isHighContrast } = useHighContrast();

  const homeClass = isHighContrast
    ? `${styles.home} ${styles.highContrast}`
    : styles.home;

  const formatPrice = (input: string) => {
    const numeric = input.replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e: { target: { value: any } }) => {
    setPrice(formatPrice(e.target.value));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !name ||
      !category ||
      !description ||
      !price ||
      !stock ||
      imagesURL.length === 0
    ) {
      setHasError(true);
      toast.error("All fields are required. Please fill in all fields.", {
        autoClose: false,
      });
      return;
    }

    const entrepreneurData = localStorage.getItem("userData");
    if (entrepreneurData) {
      const { uid } = JSON.parse(entrepreneurData);
      const numericPrice = parseFloat(price.replace(/,/g, ""));
      const numericStock = parseInt(stock);
      const newProduct = new Product(
        "",
        category,
        description,
        uid,
        imagesURL,
        name,
        numericPrice,
        numericStock,
      );
      await addProduct(newProduct);
      toast.success("Product added successfully");
      setHasError(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files).slice(0, 4);
      const storage = getStorage();

      const uploadPromises = filesArray.map((file) => {
        const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
        return uploadBytes(storageRef, file).then((snapshot) =>
          getDownloadURL(snapshot.ref),
        );
      });

      try {
        const urls = await Promise.all(uploadPromises);
        setImagesURL((prevUrls) => [...prevUrls, ...urls]);
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
  };

  return (
    <div className={homeClass}>
      <div className={styles.mainContainerCreateProduct}>
        <Form onSubmit={handleSubmit} aria-label="Create Product Form">
          <h1 className={styles.titleCreateProduct}>Create Product</h1>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  className={styles.formLabelCreateProduct}
                  htmlFor="productName"
                >
                  Product Name
                </Form.Label>
                <Form.Control
                  type="text"
                  id="productName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={name === "" && hasError ? "error" : ""}
                  isInvalid={hasError && !name}
                  placeholder="Enter product name"
                  aria-required="true"
                />
                <Form.Control.Feedback type="invalid">
                  Product name is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  className={styles.formLabelCreateProduct}
                  htmlFor="productCategory"
                >
                  Category
                </Form.Label>
                <Form.Select
                  id="productCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={category === "" && hasError ? "error" : ""}
                  isInvalid={hasError && !category}
                  aria-required="true"
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
                <Form.Control.Feedback type="invalid">
                  Category is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  className={styles.formLabelCreateProduct}
                  htmlFor="productPrice"
                >
                  Price
                </Form.Label>
                <Form.Control
                  type="text"
                  id="productPrice"
                  value={price}
                  onChange={handlePriceChange}
                  className={price === "" && hasError ? "error" : ""}
                  isInvalid={hasError && !price}
                  placeholder="$1,000"
                  aria-required="true"
                />
                <Form.Control.Feedback type="invalid">
                  Price is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  className={styles.formLabelCreateProduct}
                  htmlFor="productStock"
                >
                  Available Quantity
                </Form.Label>
                <Form.Control
                  type="number"
                  id="productStock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={stock === "" && hasError ? "error" : ""}
                  isInvalid={hasError && !stock}
                  placeholder="Enter available quantity"
                  aria-required="true"
                />
                <Form.Control.Feedback type="invalid">
                  Available quantity is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="ControlTextarea">
                <Form.Label
                  className={styles.formLabelCreateProduct}
                  htmlFor="productDescription"
                >
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  id="productDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={description === "" && hasError ? "error" : ""}
                  isInvalid={hasError && !description}
                  placeholder="Enter product description"
                  aria-required="true"
                />
                <Form.Control.Feedback type="invalid">
                  Description is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="productImages">
                <Form.Label
                  className={styles.formLabelCreateProduct}
                  htmlFor="productImages"
                >
                  Images
                </Form.Label>
                <Form.Control
                  type="file"
                  id="productImages"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*"
                  className={imagesURL.length === 0 && hasError ? "error" : ""}
                  isInvalid={hasError && imagesURL.length === 0}
                  aria-required="true"
                />
                <Form.Control.Feedback type="invalid">
                  At least one image is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Button
            type="submit"
            className={styles.btnCreateProduct}
            aria-label="Create product"
          >
            Create
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreateProduct;
