import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from './Footer.module.css';  


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
          <Col >
            <Button className={styles.footer_button}>Acerca</Button>
          </Col>
          <Col className="text-center">
            <Button className={styles.footer_button}>Comunidad</Button>
          </Col>
          <Col className="text-center">
            <Button className={styles.footer_button}>Soporte</Button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;