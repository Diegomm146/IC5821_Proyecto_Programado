import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Home.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { Stack } from "react-bootstrap";
import { auth } from "../../src/firebase/firebaseConfig";
import { getProducts, getEntrepreneurs } from "../../src/assets/Api";
import { Product, Entrepreneur } from "../../src/assets/Classes";


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
        console.error('Failed to fetch products:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.mainContainerHome}>
      <div>
        <h1 className={styles.titles}>Productos destacados</h1>
        <Stack direction="horizontal" gap={2} className={styles.horizontalScroll}>
          {products.map(product => (
            <Item 
              key={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imagesURL}
            />
          ))}
        </Stack>
      </div>
      <div>
        <h1 className={styles.titles}>Conozca nuestros estantes</h1>
        <Stack direction="horizontal" gap={2} className={styles.horizontalScroll}>
        {entrepreneurs.map(entrepreneur => (
          <EntrepreneurItem 
            key={entrepreneur.id} 
            name={entrepreneur.name} 
            logoUrl={entrepreneur.logoURL}
          />
        ))}
        </Stack>
      </div>
    </div>
  );
};

interface ItemProps {
  name: string;
  price: number;
  imageUrl: string;
}
const Item: React.FunctionComponent<ItemProps> = ({ name, price, imageUrl }) => {
  return (
    <div className={styles.itemContainer}>
      <a href={"/product-view"} target="_blank" rel="noopener noreferrer">
        <img src={'../../defaultproduct.png'}  className={styles.imgItemHome} />
      </a>
      <div className={styles.productDetails}>
        <p className={styles.textItemHome}>{name}</p>
        <p className={styles.textItemHome}>${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

interface EntrepreneurProps {
  name: string;
  logoUrl: string;
}
const EntrepreneurItem: React.FunctionComponent<EntrepreneurProps> = ({ name, logoUrl }) => {
  return (
    <div className={styles.itemContainer}>
      <a href={"/entrepreneur-profile"} target="_blank" rel="noopener noreferrer">
        <img src={logoUrl} className={styles.imgItemHome} />
      </a>
      <div className={styles.productDetails}>
        <p className={styles.textItemHome}>{name}</p>
      </div>
    </div>
  );
};




export default Home;