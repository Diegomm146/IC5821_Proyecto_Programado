import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Home.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { Stack } from "react-bootstrap";
import { auth } from "../../src/firebase/firebaseConfig";
import { getProducts, getEntrepreneurs } from "../../src/assets/Api";
import { Product, Entrepreneur } from "../../src/assets/Classes";
import { useNavigate } from 'react-router-dom';


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
        <h1 className={styles.titles}>Featured Products</h1>
        <Stack direction="horizontal" gap={2} className={styles.horizontalScroll}>
  {products.map(product => (
    <Item 
      productId={product.id}
      name={product.name}
      price={product.price}
      imagesURL={product.imagesURL}  
    />
  ))}
</Stack>
      </div>
      <div>
        <h1 className={styles.titles}>Meet Our Shelves</h1>
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
  productId: string;
  name: string;
  price: number;
  imagesURL: string[];
}

const Item: React.FunctionComponent<ItemProps> = ({ productId, name, price, imagesURL }) => {
  const navigate = useNavigate();

  // Correctly handle the click event
  const viewProduct = () => {
    navigate(`/product-view/${productId}`);
  };

  return (
    <div className={styles.itemContainer}>
      <a href="#!" onClick={viewProduct}> {/* Using #! to prevent default link behavior */}
        <img src={imagesURL[0] || '../../defaultproduct.png'} className={styles.imgItemHome} alt={name} />
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
