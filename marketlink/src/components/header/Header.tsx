import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { Person, Cart } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  return (
    <Navbar variant="dark" fixed="top" className={styles.header}>
      <Container>
        <Navbar.Brand as={Link} to="/">
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
          <Button variant="outline-light" className="mx-2" onClick={handleLoginClick}>
            <strong>Login</strong>
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
              Register
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/register-entrepreneur">Entrepreneur</Dropdown.Item>
              <Dropdown.Item as={Link} to="/register-client">Client</Dropdown.Item>
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
