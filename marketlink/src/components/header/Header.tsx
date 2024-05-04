import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../util/AuthContext'; // Asegurando importación correcta
import styles from './Header.module.css'; 

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out user:", user?.email);  // Mejor detalle del usuario que se está deslogueando
    localStorage.removeItem('userData'); // Remueve la data del usuario de localStorage
    setUser(null);  // Resetea el estado del usuario en el contexto
    navigate('/login');  // Redirige al usuario a la página de login
    console.log("User logged out and redirected to login page."); // Confirma la acción realizada
  };

  return (
    <Navbar variant="dark" fixed="top" className={styles.header} aria-label="Main Navigation">
      <Container>
        <Navbar.Brand as={Link} to="/" aria-label="Market Link Home">
          Market Link
        </Navbar.Brand>
        <Nav className="ml-auto">
          {user && user.type === 'entrepreneur' ? (
            <>
              <Nav.Link as={Link} to="/entrepreneur-profile" aria-label="View Entrepreneur Profile">Perfil</Nav.Link>
              <Nav.Link as={Link} to="/create-product" aria-label="Create Product">Crear Producto</Nav.Link>
              <Nav.Link as={Link} to="/entrepreneur-orders" aria-label="View Entrepreneur Orders">Pedidos</Nav.Link>
              <Button variant="outline-light" onClick={handleLogout} aria-label="Log Out">Cerrar Sesión</Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" aria-label="Log In">Login</Nav.Link>
              <Nav.Link as={Link} to="/register-client" aria-label="Register Client">Registrar Cliente</Nav.Link>
              <Nav.Link as={Link} to="/register-entrepreneur" aria-label="Register Entrepreneur">Registrar Emprendedor</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
