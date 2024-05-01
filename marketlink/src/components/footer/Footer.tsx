import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from './Footer.module.css';  

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
          <Col className="text-center">
            <Button className={styles.footer_button}>About</Button>
          </Col>
          <Col className="text-center">
            <Button className={styles.footer_button}>Community</Button>
          </Col>
          <Col className="text-center">
            <Button className={styles.footer_button}>Support</Button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
