import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from './Footer.module.css';
import { useHighContrast } from '../../assets/HighContrastContext';

const Footer = () => {

  const { isHighContrast } = useHighContrast();
  const footerClass = isHighContrast ? `${styles.footer} ${styles.highContrast}` : styles.footer;


  return (
    <div className={footerClass}>
    <footer className={styles.footer}>
      <Container>
        <Row>
          <Col className="text-center">
            <Button className={styles.footerButton}>About</Button>
          </Col>
          <Col className="text-center">
            <Button className={styles.footerButton}>Community</Button>
          </Col>
          <Col className="text-center">
            <Button className={styles.footerButton}>Support</Button>
          </Col>
        </Row>
      </Container>
    </footer>
    </div>
  );
};

export default Footer;
