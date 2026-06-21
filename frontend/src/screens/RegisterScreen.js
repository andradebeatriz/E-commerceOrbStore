import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem');
    } else {
      setMessage(null);
      dispatch(register(name, email, password));
    }
  };

  return (
    <div className="login-page">
      {/* Lado Hero */}
      <div className="login-hero">
        <p className="hero-badge">Crie sua conta</p>
        <h2 className="hero-title">
          Junte-se<br />
          <span>a nós</span>
        </h2>
        <p className="hero-sub">
          Crie sua conta para acompanhar pedidos, salvar favoritos e receber ofertas exclusivas.
        </p>
        <div className="hero-trust">
          <div>
            <span className="trust-num"><i className="fas fa-user-plus me-1"></i> Grátis</span>
            <span className="trust-label">Cadastro</span>
          </div>
          <div>
            <span className="trust-num"><i className="fas fa-shield-alt me-1"></i> 100%</span>
            <span className="trust-label">Seguro</span>
          </div>
          <div>
            <span className="trust-num"><i className="fas fa-heart me-1"></i> Fácil</span>
            <span className="trust-label">De usar</span>
          </div>
        </div>
      </div>

      {/* Lado Formulário */}
      <div className="login-form-side">
        <div className="login-box">
          <h2>Cadastro</h2>
          <p className="login-subtitle">
            Já tem conta?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
              Faça login
            </Link>
          </p>

          {message && <div className="login-error">{message}</div>}
          {error && <div className="login-error">{error}</div>}
          {loading && <Loader />}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

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
                placeholder="Escolha uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Label>Confirmar Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2 mt-1"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </Form>

          <div className="login-footer">
            Ao se cadastrar, você concorda com nossos{' '}
            <a href="#termos">termos</a> e <a href="#politicas">políticas</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;