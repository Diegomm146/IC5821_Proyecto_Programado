import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Home.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { Stack } from "react-bootstrap";
import { getProducts, getEntrepreneurs } from "../../src/assets/Api";
import { Product, Entrepreneur } from "../../src/assets/Classes";
import { useNavigate, Link } from 'react-router-dom';

const Home: FunctionComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        const fetchedEntrepreneurs = await getEntrepreneurs();
        setEntrepreneurs(fetchedEntrepreneurs);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.mainContainerHome}>
      <section>
        <h1 className={styles.titles}>Featured Products</h1>
        <Stack direction="horizontal" gap={3} className={styles.horizontalScroll}>
          {products.map(product => (
            <Item key={product.id} product={product} />
          ))}
        </Stack>
      </section>
      <section>
        <h1 className={styles.titles}>Meet Our Shelves</h1>
        <Stack direction="horizontal" gap={3} className={styles.horizontalScroll}>
          {entrepreneurs.map(entrepreneur => (
            <EntrepreneurItem key={entrepreneur.id} entrepreneur={entrepreneur} />
          ))}
        </Stack>
      </section>
    </div>
  );
};

const Item = ({ product }: { product: Product }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.itemContainer} onClick={() => navigate(`/product-view/${product.id}`)} role="button" tabIndex={0}>
      <img src={product.imagesURL[0] || '../../defaultproduct.png'} className={styles.imgItemHome} alt={product.name} />
      <div className={styles.productDetails}>
        <p className={styles.textItemHome}>{product.name}</p>
        <p className={styles.textItemHome}>${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

const EntrepreneurItem = ({ entrepreneur }: { entrepreneur: Entrepreneur }) => {
  return (
    <div className={styles.itemContainer}>
      <Link to={`/entrepreneur-profile/${entrepreneur.id}`}>
        <img src={entrepreneur.logoURL || '../../defaultentrepreneur.png'} className={styles.imgItemEntrepreneur} alt={entrepreneur.name} />
      </Link>
      <div className={styles.productDetails}>
        <p className={styles.textItemHome}>{entrepreneur.name}</p>
      </div>
    </div>
  );
};

export default Home;
