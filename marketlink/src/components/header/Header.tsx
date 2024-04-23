import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Person, Cart } from 'react-bootstrap-icons'; 
import styles from './Header.module.css'; 

const Header = () => {
  return (
    <Navbar variant="dark" expand="lg" className={styles.header}>
      <Container>
      <Navbar.Brand href="#home">
            <img
              alt=""
              src="/../../../public/image.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />
            {'Market Link'}
          </Navbar.Brand>
        <Nav className="ml-auto">
          <Button variant="no-outline" className={styles.whiteTextButton} > <strong>Iniciar Sesión o</strong> <br /> Registrarse</Button>
          <Button variant="no-outline" className="mx-2" >
            <Cart color="white" size={30} />
          </Button>
          <Button variant="no-outline" >
            <Person color="white" size={30} />
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
