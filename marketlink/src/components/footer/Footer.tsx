import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from './Footer.module.css';

const Footer = () => {
  return (
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
  );
};

export default Footer;
