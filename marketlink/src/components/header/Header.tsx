import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { Person, Cart } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <Navbar variant="dark" expand="lg" className={styles.header}>
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="/../../../image.png"
            width="50"
            height="50"
            className="d-inline-block align-top"
          />
          {'Market Link'}
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Button variant="outline-light" className="mx-2">
            <strong>Iniciar Sesión</strong>
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
              Registrarse
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/register-entrepreneur">Emprendedor</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Cliente</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-light" className="mx-2">
            <Cart color="white" size={30} />
          </Button>
          <Button variant="outline-light">
            <Person color="white" size={30} />
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
