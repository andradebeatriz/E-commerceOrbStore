import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions';
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, successPay, successDeliver, order]);

  const simulatePaymentHandler = () => {
    const paymentResult = {
      id: `SIMULADO-${Date.now()}`,
      status: 'COMPLETO',
      update_time: new Date().toISOString(),
      email_address: userInfo.email,
    };
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  if (loading) return <Loader />;
  if (error)   return <Message variant="danger">{error}</Message>;

  // Guard: pedido sem usuário vinculado (usuário deletado)
  const orderUser = order.user || null;

  const itemsPrice = order.orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  /* ---- estilos inline reutilizados ---- */
  const sectionStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--r-lg)',
    padding: '1.5rem',
    marginBottom: '1rem',
  };

  const labelStyle = { color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 };
  const valueStyle = { color: 'var(--text-primary)', fontWeight: 500 };

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link className="btn btn-light btn-sm" to="/admin/orderlist">
          <i className="fas fa-arrow-left me-1"></i> Voltar
        </Link>
        <h1 className="mb-0" style={{ fontSize: '1.4rem' }}>
          Pedido <span style={{ color: 'var(--blue-100)', fontFamily: 'monospace', fontSize: '1rem' }}>#{order._id}</span>
        </h1>
      </div>

      <Row>
        {/* ===== Coluna esquerda ===== */}
        <Col md={8}>

          {/* Entrega */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              <i className="fas fa-truck me-2" style={{ color: 'var(--blue-100)' }}></i>
              Endereço de Entrega
            </h2>

            {/* Guard: exibe aviso se usuário foi deletado */}
            {orderUser ? (
              <>
                <p style={valueStyle}><span style={labelStyle}>Nome: </span>{orderUser.name}</p>
                <p style={valueStyle}>
                  <span style={labelStyle}>Email: </span>
                  <a href={`mailto:${orderUser.email}`} style={{ color: 'var(--blue-100)' }}>
                    {orderUser.email}
                  </a>
                </p>
              </>
            ) : (
              <Message variant="warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Usuário desta conta foi removido do sistema.
              </Message>
            )}

            <p style={valueStyle}>
              <span style={labelStyle}>Endereço: </span>
              {order.shippingAddress.address}, {order.shippingAddress.city} — {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>

            {order.isDelivered ? (
              <Message variant="success">
                <i className="fas fa-check-circle me-2"></i>
                Entregue em {new Date(order.deliveredAt).toLocaleDateString('pt-BR')}
              </Message>
            ) : (
              <Message variant="warning">
                <i className="fas fa-clock me-2"></i>
                Aguardando entrega
              </Message>
            )}
          </div>

          {/* Pagamento */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              <i className="fas fa-credit-card me-2" style={{ color: 'var(--blue-100)' }}></i>
              Método de Pagamento
            </h2>
            <p style={valueStyle}><span style={labelStyle}>Método: </span>{order.paymentMethod}</p>
            {order.isPaid ? (
              <Message variant="success">
                <i className="fas fa-check-circle me-2"></i>
                Pago em {new Date(order.paidAt).toLocaleDateString('pt-BR')}
              </Message>
            ) : (
              <Message variant="warning">
                <i className="fas fa-clock me-2"></i>
                Pagamento pendente
              </Message>
            )}
          </div>

          {/* Itens */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              <i className="fas fa-box-open me-2" style={{ color: 'var(--blue-100)' }}></i>
              Itens do Pedido
            </h2>

            {order.orderItems.length === 0 ? (
              <Message>O pedido está vazio</Message>
            ) : (
              <div className="d-flex flex-column gap-2">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--r-md)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      rounded
                      style={{ width: '52px', height: '44px', objectFit: 'cover', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <Link to={`/product/${item.product}`} style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                        {item.name}
                      </Link>
                    </div>
                    <div style={{ color: 'var(--blue-100)', fontWeight: 700, whiteSpace: 'nowrap', fontSize: '0.88rem' }}>
                      {item.qty} × R$ {item.price.toFixed(2)}
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '0.3rem' }}>
                        = R$ {(item.qty * item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* ===== Coluna direita — resumo ===== */}
        <Col md={4}>
          <div style={{ ...sectionStyle, position: 'sticky', top: '80px' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>
              <i className="fas fa-receipt me-2" style={{ color: 'var(--blue-100)' }}></i>
              Resumo do Pedido
            </h2>

            {[
              { label: 'Itens',     value: `R$ ${itemsPrice.toFixed(2)}` },
              { label: 'Frete',     value: `R$ ${order.shippingPrice.toFixed(2)}` },
              { label: 'Impostos',  value: `R$ ${order.taxPrice.toFixed(2)}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="d-flex justify-content-between mb-2"
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
              >
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}

            <div
              className="d-flex justify-content-between pt-3 mt-2 mb-4"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
              <span className="price-big" style={{ fontSize: '1.5rem' }}>
                R$ {order.totalPrice.toFixed(2)}
              </span>
            </div>

            {!order.isPaid && (
              <>
                {loadingPay && <Loader />}
                <Button
                  variant="primary"
                  className="w-100 mb-2 py-2"
                  onClick={simulatePaymentHandler}
                  style={{ fontSize: '0.95rem' }}
                >
                  <i className="fas fa-lock me-2"></i>
                  Pagar ({order.paymentMethod})
                </Button>
              </>
            )}

            {loadingDeliver && <Loader />}

            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <Button
                variant="success"
                className="w-100 py-2"
                onClick={deliverHandler}
                style={{ background: 'var(--color-success)', border: 'none', fontSize: '0.95rem' }}
              >
                <i className="fas fa-truck me-2"></i>
                Marcar como Entregue
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;