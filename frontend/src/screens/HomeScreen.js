import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Pagination from '../components/Pagination';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const { keyword, pageNumber } = useParams();
  const page = pageNumber || 1;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page: currentPage, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, page));
  }, [dispatch, keyword, page]);

  return (
    <>
      {/* Hero Banner */}
      {!keyword && (
        <div className="hero-banner mb-4">
          <h2>Encontre os melhores produtos com preços imperdíveis</h2>
          <p>Frete rápido, garantia e segurança nas compras — aproveite ofertas diárias.</p>
        </div>
      )}

      {/* Título da seção */}
      <h1 className="mb-4">
        {keyword ? `Resultados para: "${keyword}"` : 'Produtos em Destaque'}
      </h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {products && products.length === 0 ? (
            <Message variant="info">
              Nenhum produto encontrado para "{keyword}".
            </Message>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product._id} xs={12} sm={6} md={6} lg={4} xl={3} className="mb-4">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
          <Pagination pages={pages} page={currentPage} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default HomeScreen;