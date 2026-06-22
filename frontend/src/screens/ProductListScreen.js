import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Table, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import { AdminSidebar } from './DashboardScreen';

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo || !userInfo.isAdmin) { navigate('/login'); return; }
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts('', pageNumber || ''));
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, pageNumber]);

  const deleteHandler = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <Row>
      <Col md={3} className="mb-4">
        <AdminSidebar />
      </Col>
      <Col md={9}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Produtos</h1>
          <Button variant="primary" onClick={createProductHandler}>
            <i className="fas fa-plus me-2"></i>Criar Produto
          </Button>
        </div>

        {(loadingDelete || loadingCreate) && <Loader />}
        {errorDelete && <Message variant="danger">{errorDelete}</Message>}
        {errorCreate && <Message variant="danger">{errorCreate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>IMAGEM</th>
                  <th>NOME</th>
                  <th>PREÇO</th>
                  <th>ESTOQUE</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 && products.map((product) => (
                  <tr key={product._id}>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {product._id}
                    </td>
                    <td>
                      <Image
                        src={product.image}
                        alt={product.name}
                        rounded
                        style={{ width: '48px', height: '40px', objectFit: 'cover', border: '1px solid var(--border)' }}
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>R$ {product.price.toFixed(2)}</td>
                    <td>
                      <span className={product.countInStock > 0 ? 'badge-stock-in' : 'badge-stock-out'}>
                        {product.countInStock}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm me-2">
                          <i className="fas fa-edit"></i> Editar
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <i className="fas fa-trash"></i> Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination pages={pages} page={page} isAdmin={true} />
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProductListScreen;