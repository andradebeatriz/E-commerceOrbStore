import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    error: errorProductReview,
    loading: loadingProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
  }, [dispatch, id, successProductReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitReviewHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  };

  const inStock = product.countInStock > 0;

  return (
    <>
      <Link className="btn btn-light mb-4" to="/">
        <i className="fas fa-arrow-left me-2"></i>Voltar
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className="product-detail-wrap">
            <Row>
              {/* Imagem */}
              <Col md={5}>
                <div className="product-img-wrapper">
                  <img src={product.image} alt={product.name} />
                </div>
              </Col>

              {/* Informações */}
              <Col md={7}>
                <div className="d-flex flex-column gap-3 h-100">
                  <div>
                    <h1 className="product-info-name mb-1">{product.name}</h1>
                    <p className="product-info-desc">{product.description}</p>
                  </div>

                  <div className="mb-1">
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} avaliações`}
                    />
                  </div>

                  {/* Card de preço */}
                  <div className="price-card">
                    <div className="d-flex justify-content-between align-items-baseline mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        PREÇO
                      </span>
                      <span className="price-big">
                        R$ {product.price?.toFixed(2)}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                        Disponibilidade
                      </span>
                      <span className={inStock ? 'badge-stock-in' : 'badge-stock-out'} style={{ fontSize: '0.85rem', padding: '0.35em 0.9em' }}>
                        {inStock ? `${product.countInStock} em estoque` : 'Esgotado'}
                      </span>
                    </div>
                  </div>

                  {/* Seletor de quantidade e botão */}
                  {inStock && (
                    <div className="qty-control-group">
                      <span className="qty-label-text">Quantidade:</span>
                      <div className="qty-wrapper">
                        <button
                          className="qty-btn"
                          onClick={() => setQty(q => Math.max(1, q - 1))}
                          type="button"
                        >−</button>
                        <input
                          className="qty-input"
                          type="number"
                          value={qty}
                          readOnly
                        />
                        <button
                          className="qty-btn"
                          onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                          type="button"
                        >+</button>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={addToCartHandler}
                    variant="primary"
                    size="lg"
                    disabled={!inStock}
                    className="w-100 py-3"
                    style={{ fontSize: '1rem', letterSpacing: '0.02em' }}
                  >
                    🛒 {inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          {/* Avaliações */}
          <Row className="mt-4">
            <Col md={7}>
              <h2 className="mb-3">Avaliações dos Clientes</h2>

              {product.reviews && product.reviews.length === 0 && (
                <Message variant="info">Nenhuma avaliação ainda. Seja o primeiro!</Message>
              )}

              <div className="d-flex flex-column gap-2 mb-4">
                {product.reviews && product.reviews.length > 0 && product.reviews.map(review => (
                  <div key={review._id} className="review-item">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="review-author">{review.name}</span>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Rating value={review.rating} />
                    <p className="mt-2 mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Form de avaliação */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--r-lg)', padding: '1.5rem' }}>
                <h3 className="mb-3" style={{ fontSize: '1.1rem' }}>Avaliar este Produto</h3>

                {successProductReview && (
                  <Message variant="success">Avaliação enviada com sucesso!</Message>
                )}
                {loadingProductReview && <Loader />}
                {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}

                {userInfo ? (
                  <Form onSubmit={submitReviewHandler}>
                    <Form.Group controlId="rating" className="mb-3">
                      <Form.Label>Nota</Form.Label>
                      <Form.Select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        <option value="0">Selecione...</option>
                        <option value="1">1 — Ruim</option>
                        <option value="2">2 — Razoável</option>
                        <option value="3">3 — Bom</option>
                        <option value="4">4 — Muito Bom</option>
                        <option value="5">5 — Excelente</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="comment" className="mb-3">
                      <Form.Label>Comentário</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Conte sua experiência com o produto..."
                      />
                    </Form.Group>

                    <Button
                      disabled={loadingProductReview || rating === 0}
                      type="submit"
                      variant="primary"
                    >
                      Enviar Avaliação
                    </Button>
                  </Form>
                ) : (
                  <Message variant="info">
                    Por favor, <Link to="/login">faça login</Link> para avaliar este produto.
                  </Message>
                )}
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;