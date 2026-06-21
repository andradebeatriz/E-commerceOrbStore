import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="login-page">
      {/* Lado Hero */}
      <div className="login-hero">
        <p className="hero-badge">Bem-vindo</p>
        <h2 className="hero-title">
          O melhor<br />
          <span>e-commerce</span>
        </h2>
        <p className="hero-sub">
          Garanta os melhores produtos com os melhores preços e entrega garantida.
        </p>
        <div className="hero-trust">
          <div>
            <span className="trust-num">500+</span>
            <span className="trust-label">Clientes</span>
          </div>
          <div>
            <span className="trust-num">100%</span>
            <span className="trust-label">Confiabilidade</span>
          </div>
          <div>
            <span className="trust-num">24h</span>
            <span className="trust-label">Suporte</span>
          </div>
        </div>
      </div>

      {/* Lado Formulário */}
      <div className="login-form-side">
        <div className="login-box">
          <h2>Login</h2>
          <p className="login-subtitle">Acesse sua conta para continuar</p>

          {error && <div className="login-error">{error}</div>}
          {loading && <Loader />}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2 mt-1"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>

          <div className="login-divider">
            <span>ou</span>
          </div>

          <p className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Não tem conta?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
              Cadastre-se
            </Link>
          </p>

          <div className="login-footer">
            Ao entrar, você concorda com nossos{' '}
            <a href="#termos">Termos</a> e <a href="#politicas">Políticas</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;