import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!shippingAddress || !shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PIX');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Método de Pagamento</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Selecione o Método</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PIX"
              id="pix"
              name="paymentMethod"
              value="PIX"
              checked={paymentMethod === 'PIX'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

            <Form.Check
              type="radio"
              label="Cartão de Crédito"
              id="creditCard"
              name="paymentMethod"
              value="Cartão de Crédito"
              checked={paymentMethod === 'Cartão de Crédito'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

            <Form.Check
              type="radio"
              label="Boleto"
              id="boleto"
              name="paymentMethod"
              value="Boleto"
              checked={paymentMethod === 'Boleto'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Continuar
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
