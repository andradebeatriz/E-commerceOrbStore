import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getDashboardSummary } from '../actions/adminActions';

/* Sidebar reutilizável para o painel admin */
export const AdminSidebar = () => {
  const location = useLocation();
  const links = [
    { to: '/admin/dashboard', icon: 'fas fa-chart-bar',  label: 'Dashboard' },
    { to: '/admin/productlist', icon: 'fas fa-box',      label: 'Produtos'  },
    { to: '/admin/orderlist',  icon: 'fas fa-file-alt',  label: 'Pedidos'   },
    { to: '/admin/userlist',   icon: 'fas fa-users',     label: 'Usuários'  },
  ];

  return (
    <div className="admin-sidebar">
      <h5>Painel Admin</h5>
      <p>Gerencie produtos, pedidos e usuários</p>
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className={`admin-nav-link ${location.pathname === l.to ? 'active' : ''}`}
        >
          <i className={`${l.icon} me-2`}></i>{l.label}
        </Link>
      ))}
    </div>
  );
};

/* Ícones Font Awesome para os cards do dashboard */
const CARD_ICONS = {
  users:    { icon: 'fas fa-users',    color: '#60a5fa' },
  products: { icon: 'fas fa-box',      color: '#34d399' },
  orders:   { icon: 'fas fa-file-alt', color: '#fbbf24' },
  revenue:  { icon: 'fa-solid fa-sack-dollar', color: '#a78bfa' },
};

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const adminSummary = useSelector((state) => state.adminSummary);
  const { loading, error, summary } = adminSummary;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getDashboardSummary());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  const cards = summary
    ? [
        { label: 'Total de Usuários',  value: summary.totalUsers,                       ...CARD_ICONS.users    },
        { label: 'Total de Produtos',  value: summary.totalProducts,                    ...CARD_ICONS.products },
        { label: 'Total de Pedidos',   value: summary.totalOrders,                      ...CARD_ICONS.orders   },
        { label: 'Receita Total',      value: `R$ ${summary.totalRevenue?.toFixed(2)}`, ...CARD_ICONS.revenue  },
      ]
    : [];

  return (
    <Row>
      <Col md={3} className="mb-4">
        <AdminSidebar />
      </Col>
      <Col md={9}>
        <h1>Dashboard</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row className="g-3 my-2">
            {cards.map((c) => (
              <Col key={c.label} sm={6} xl={3}>
                <Card className="text-center p-3">
                  <Card.Body>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: `${c.color}18`,
                        border: `1px solid ${c.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem',
                      }}
                    >
                      <i
                        className={c.icon}
                        style={{ fontSize: '1.3rem', color: c.color }}
                      ></i>
                    </div>
                    <Card.Title>{c.label}</Card.Title>
                    <h2>{c.value}</h2>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default DashboardScreen;