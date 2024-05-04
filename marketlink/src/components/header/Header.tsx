import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../util/AuthContext';
import styles from './Header.module.css'; 
import { FaHome, FaUserCircle, FaPlusCircle, FaBoxOpen, FaSignInAlt, FaUserPlus, FaSignOutAlt  } from 'react-icons/fa';
import { CiShoppingCart } from "react-icons/ci";


const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  console.log("User in header:", user)
  console.log("Logging out user:", user?.type); 
  console.log("user:", user); 
  const handleLogout = () => {
    localStorage.removeItem('userData'); 
    setUser(null);  
    navigate('/login'); 
    console.log("User logged out and redirected to login page."); 
  };

  return (
<Navbar variant="dark" fixed="top" className={styles.header} aria-label="Main Navigation">
  <Container>
    <Navbar.Brand as={Link} to="/" aria-label="Market Link Home">
      <FaHome /> Market Link
    </Navbar.Brand>
    <Nav className="ml-auto custom-nav">
      {user && user.type === 'entrepreneur' ? (
        <>
          <Nav.Link as={Link} to="/entrepreneur-profile" className="nav-link" aria-label="View Entrepreneur Profile"><FaUserCircle /> Perfil</Nav.Link>
          <Nav.Link as={Link} to="/create-product" className="nav-link" aria-label="Create Product"><FaPlusCircle /> Crear Producto</Nav.Link>
          <Nav.Link as={Link} to="/entrepreneur-orders" className="nav-link" aria-label="View Entrepreneur Orders"><FaBoxOpen /> Pedidos</Nav.Link>
          <Button variant="outline-light" className="whiteTextButton" onClick={handleLogout} aria-label="Log Out"><FaSignOutAlt /> Cerrar Sesión</Button>
        </>
      ) : user && user.type === 'client' ? (
        <>
          <Nav.Link as={Link} to="/client-profile" className="nav-link" aria-label="View Client Profile"><FaUserCircle /> Client Profile</Nav.Link>
          <Nav.Link as={Link} to="/client-orders" className="nav-link" aria-label="View Client Orders"><FaBoxOpen /> Clients Orders</Nav.Link>
          <Nav.Link as={Link} to="/cart" className="nav-link" aria-label="View Client Cart"><CiShoppingCart /> Cart</Nav.Link>
          <Button variant="outline-light" className="whiteTextButton" onClick={handleLogout} aria-label="Log Out"><FaSignOutAlt /> Close Session</Button>
        </>
      ) : (
        <>
          <Nav.Link as={Link} to="/login" className="nav-link" aria-label="Log In"><FaSignInAlt /> Login</Nav.Link>
          <Nav.Link as={Link} to="/register-client" className="nav-link" aria-label="Register Client"><FaUserPlus /> Registrar Cliente</Nav.Link>
          <Nav.Link as={Link} to="/register-entrepreneur" className="nav-link" aria-label="Register Entrepreneur"><FaUserPlus /> Registrar Emprendedor</Nav.Link>
        </>
      )}
    </Nav>
  </Container>
</Navbar>

  );
};

export default Header;
