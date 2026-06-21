import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className="py-3">
          <Col md={4} className="mb-3 mb-md-0">
            <h6 style={{ color: 'var(--blue-100)', fontWeight: 700, marginBottom: '0.75rem' }}>
              OrbShop
            </h6>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.65, margin: 0 }}>
              A sua loja online de confiança. Produtos com qualidade e entrega garantida.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Sobre
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Quem Somos', 'Política de Privacidade', 'Termos de Uso'].map((item) => (
                <li key={item} style={{ marginBottom: '0.35rem' }}>
                  <p href="#" style={{ fontSize: '0.82rem' }}>{item}</p>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Contato
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.35rem', fontSize: '0.82rem' }}>
                <i className="fas fa-envelope me-2" style={{ color: 'var(--blue-200)' }}></i>
                suporte@orbshop.com
              </li>
              <li style={{ fontSize: '0.82rem' }}>
                <i className="fas fa-phone me-2" style={{ color: 'var(--blue-200)' }}></i>
                (11) 4002-8922
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="text-center pt-3" style={{ borderTop: '1px solid var(--border)', fontSize: '0.78rem' }}>
            OrbShop &copy; {new Date().getFullYear()} — Todos os direitos reservados
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;