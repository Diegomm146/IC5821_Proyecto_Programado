import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../util/AuthContext';
import { useHighContrast } from '../../../src/assets/HighContrastContext';
import styles from './Header.module.css';
import { FaHome, FaUserCircle, FaPlusCircle, FaBoxOpen, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaAdjust, FaSun, FaMoon } from 'react-icons/fa';
import { CiShoppingCart } from "react-icons/ci";
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

const Header = () => {
  const { user, setUser } = useAuth();
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const navigate = useNavigate();

  const headerClass = isHighContrast ? `${styles.header} ${styles.highContrast}` : styles.header;

  const handleLogout = async () => {
    try {
      localStorage.removeItem('userData');
      setUser(null);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={headerClass}>
    <Navbar as="header" variant="dark" fixed="top" className={headerClass} aria-label="Main Navigation">
      <Container>
        <Navbar.Brand as={Link} to="/" aria-label="Go to Home Page">
          <FaHome aria-hidden="true" /> Market Link
        </Navbar.Brand>
        <Nav className="ml-auto custom-nav">
          {user ? (
            user.type === 'entrepreneur' ? (
              <EntrepreneurNavLinks handleLogout={handleLogout} />
            ) : (
              <ClientNavLinks handleLogout={handleLogout} />
            )
          ) : (
            <PublicNavLinks />
          )}
          {/* Botón de alternancia para el modo de alto contraste */}
          <Button variant="outline-light" onClick={toggleHighContrast} aria-label="Toggle High Contrast Mode" className="icon-container">
            {isHighContrast ? <FaMoon /> : <FaSun />}
          </Button>
        </Nav>
      </Container>
    </Navbar>
    </div>
  );
};

const EntrepreneurNavLinks = ({ handleLogout }: { handleLogout: () => void }) => (
  <>
    <Nav.Link as={Link} to="/entrepreneur-profile" className="nav-link" aria-label="Entrepreneur Profile"><FaUserCircle aria-hidden="true" /> Profile</Nav.Link>
    <Nav.Link as={Link} to="/create-product" className="nav-link" aria-label="Create Product"><FaPlusCircle aria-hidden="true" /> Create Product</Nav.Link>
    <Nav.Link as={Link} to="/entrepreneur-orders" className="nav-link" aria-label="Entrepreneur Orders"><FaBoxOpen aria-hidden="true" /> Orders</Nav.Link>
    <Button variant="outline-light" className="whiteTextButton" onClick={handleLogout} aria-label="Log Out"><FaSignOutAlt aria-hidden="true" /> Log out</Button>
  </>
);

const ClientNavLinks = ({ handleLogout }: { handleLogout: () => void }) => (
  <>
    <Nav.Link as={Link} to="/client-profile" className="nav-link" aria-label="Client Profile"><FaUserCircle aria-hidden="true" /> Profile</Nav.Link>
    <Nav.Link as={Link} to="/client-orders" className="nav-link" aria-label="Client Orders"><FaBoxOpen aria-hidden="true" /> Orders</Nav.Link>
    <Nav.Link as={Link} to="/cart" className="nav-link" aria-label="Shopping Cart"><CiShoppingCart aria-hidden="true" /> Cart</Nav.Link>
    <Button variant="outline-light" className="whiteTextButton" onClick={handleLogout} aria-label="Log Out"><FaSignOutAlt aria-hidden="true" /> Log out</Button>
  </>
);

const PublicNavLinks = () => (
  <>
    <Nav.Link as={Link} to="/login" className="nav-link" aria-label="Log In"><FaSignInAlt aria-hidden="true" /> Login</Nav.Link>
    <Nav.Link as={Link} to="/register-client" className="nav-link" aria-label="Register as Client"><FaUserPlus aria-hidden="true" /> Register as Client</Nav.Link>
    <Nav.Link as={Link} to="/register-entrepreneur" className="nav-link" aria-label="Register as Entrepreneur"><FaUserPlus aria-hidden="true" /> Register as Entrepreneur</Nav.Link>
  </>
);

export default Header;
