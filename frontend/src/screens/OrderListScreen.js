import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions';
import { AdminSidebar } from './DashboardScreen';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <Row>
      <Col md={3} className="mb-4">
        <AdminSidebar />
      </Col>

      <Col md={9}>
        <h1>Pedidos</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USUÁRIO</th>
                <th>DATA</th>
                <th>TOTAL</th>
                <th>PAGO</th>
                <th>ENTREGUE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {order._id}
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {order.user && order.user.name}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td style={{ color: 'var(--blue-100)', fontWeight: 700 }}>
                    R$ {order.totalPrice.toFixed(2)}
                  </td>
                  <td>
                    {order.isPaid ? (
                      <span className="badge-stock-in">
                        <i className="fas fa-check me-1"></i>
                        {new Date(order.paidAt).toLocaleDateString('pt-BR')}
                      </span>
                    ) : (
                      <span className="badge-stock-out">
                        <i className="fas fa-times me-1"></i>
                        Não pago
                      </span>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <span className="badge-stock-in">
                        <i className="fas fa-check me-1"></i>
                        {new Date(order.deliveredAt).toLocaleDateString('pt-BR')}
                      </span>
                    ) : (
                      <span className="badge-stock-out">
                        <i className="fas fa-times me-1"></i>
                        Pendente
                      </span>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-eye me-1"></i>Detalhes
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default OrderListScreen;