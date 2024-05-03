
import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../util/AuthContext';
import styles from './Header.module.css'; 

const Header = () => {
  const { user, setUser } = useAuth();  
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out user:", user);  // Añadir para ver qué usuario está siendo deslogueado
    localStorage.removeItem('userData'); // Remueve la data del usuario de localStorage
    setUser(null);  // Resetea el estado del usuario en el contexto
    navigate('/login');  // Redirige al usuario a la página de login
  };

  return (
    <Navbar variant="dark" fixed="top" className={styles.header}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          Market Link
        </Navbar.Brand>
        <Nav className="ml-auto">
          {user && user.type === 'entrepreneur' ? (
            <>
              <Nav.Link as={Link} to="/entrepreneur-profile">Perfil</Nav.Link>
              <Nav.Link as={Link} to="/create-product">Crear Producto</Nav.Link>
              <Nav.Link as={Link} to="/entrepreneur-orders">Pedidos</Nav.Link>
              <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesión</Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register-client">Registrar Cliente</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
