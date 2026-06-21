import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="checkout-steps">
      <Nav.Item>
        {step1 ? (
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Login</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <Nav.Link as={Link} to="/shipping">
            Endereço
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Endereço</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <Nav.Link as={Link} to="/payment">
            Pagamento
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Pagamento</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <Nav.Link as={Link} to="/placeorder">
            Pedido
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Pedido</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
