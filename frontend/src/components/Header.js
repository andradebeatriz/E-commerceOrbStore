import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/" className="header-brand">
            OrbStore
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ms-auto align-items-lg-center">
              <Nav.Link as={Link} to="/cart" className="d-flex align-items-center gap-1">
                <i className="fas fa-shopping-cart"></i>
                <span>Carrinho</span>
                {cartItems.length > 0 && (
                  <span className="badge ms-1">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </Nav.Link>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="fas fa-user me-2"></i>Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/myorders">
                    <i className="fas fa-box me-2"></i>Meus Pedidos
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt me-2"></i>Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <i className="fas fa-user me-1"></i> Entrar
                </Nav.Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    <i className="fas fa-users me-2"></i>Usuários
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/productlist">
                    <i className="fas fa-box-open me-2"></i>Produtos
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist">
                    <i className="fas fa-receipt me-2"></i>Pedidos
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/dashboard">
                    <i className="fas fa-chart-bar me-2"></i>Dashboard
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;