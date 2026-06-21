import React, { useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Form, Button } from 'react-bootstrap';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const qty = location.search
    ? Number(new URLSearchParams(location.search).get('qty'))
    : 1;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <h1 className="mb-4">Seu Carrinho</h1>

      {cartItems.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--r-xl)',
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Seu carrinho está vazio
          </p>
          <Link to="/" className="btn btn-primary px-4 py-2">
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <Row>
          {/* Itens */}
          <Col md={8} className="mb-4">
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden'
            }}>
              {cartItems.map((item, index) => (
                <div
                  key={item.product}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: index < cartItems.length - 1 ? '1px solid var(--border)' : 'none'
                  }}
                >
                  <Row className="align-items-center g-3">
                    <Col xs={3} md={2}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                        className="cart-item-image"
                      />
                    </Col>
                    <Col xs={9} md={4}>
                      <Link
                        to={`/product/${item.product}`}
                        style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col xs={4} md={2} className="text-center">
                      <span style={{ color: 'var(--blue-100)', fontWeight: 700 }}>
                        R$ {item.price.toFixed(2)}
                      </span>
                    </Col>
                    <Col xs={4} md={2}>
                      <Form.Select
                        size="sm"
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(addToCart(item.product, Number(e.target.value)))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col xs={4} md={2} className="text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Col>

          {/* Resumo */}
          <Col md={4}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--r-xl)',
              padding: '1.5rem',
              position: 'sticky',
              top: '80px'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                Resumo do Pedido
              </h3>

              <div className="d-flex justify-content-between mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Frete</span>
                <span style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 600 }}>
                  {subtotal > 500 ? 'Grátis' : 'R$ 30.00'}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
                <span className="price-big" style={{ fontSize: '1.6rem' }}>
                  R$ {(subtotal + (subtotal > 500 ? 0 : 30)).toFixed(2)}
                </span>
              </div>

              <Button
                variant="primary"
                className="w-100 py-2"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                style={{ fontSize: '1rem' }}
              >
                Finalizar Compra
              </Button>

              <Link to="/" className="btn btn-light w-100 mt-2 py-2" style={{ fontSize: '0.88rem' }}>
                Continuar Comprando
              </Link>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CartScreen;