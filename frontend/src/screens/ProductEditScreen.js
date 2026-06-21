import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import { AdminSidebar } from './DashboardScreen';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate('/admin/productlist');
    } else {
      if (!product || !product._id || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setImagePreview(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate]);

  /* Upload do arquivo para o backend */
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview local imediato
    setImagePreview(URL.createObjectURL(file));
    setUploadError('');

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data.image);   // caminho salvo no banco
    } catch (err) {
      setUploadError('Erro ao fazer upload da imagem. Verifique o tamanho (máx 5 MB).');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({ _id: productId, name, price, image, brand, category, description, countInStock })
    );
  };


  return (
    <Row>
      <Col md={3} className="mb-4">
        <AdminSidebar />
      </Col>

      <Col md={9}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to="/admin/productlist" className="btn btn-light btn-sm">
            <i className="fas fa-arrow-left me-1"></i> Voltar
          </Link>
          <h1 className="mb-0">Editar Produto</h1>
        </div>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--r-xl)', padding: '2rem' }}>
            <Form onSubmit={submitHandler}>
              <Row>
                {/* Coluna principal */}
                <Col md={7}>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Nome do Produto</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </Form.Group>

                  <Row>
                    <Col>
                      <Form.Group controlId="price" className="mb-3">
                        <Form.Label>Preço (R$)</Form.Label>
                        <Form.Control type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="countInStock" className="mb-3">
                        <Form.Label>Estoque</Form.Label>
                        <Form.Control type="number" min="0" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group controlId="brand" className="mb-3">
                        <Form.Label>Marca</Form.Label>
                        <Form.Control type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="category" className="mb-3">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as="textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                  </Form.Group>
                </Col>

                {/* Coluna de imagem */}
                <Col md={5}>
                  <Form.Label>Imagem do Produto</Form.Label>

                  {/* Preview */}
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: 'var(--bg-surface)',
                    border: '2px dashed var(--border)',
                    borderRadius: 'var(--r-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: '0.75rem',
                  }}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--r-lg)' }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <i className="fas fa-image" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                        <span style={{ fontSize: '0.82rem' }}>Sem imagem</span>
                      </div>
                    )}
                  </div>

                  {/* Upload de arquivo */}
                  <Form.Group controlId="imageFile" className="mb-3">
                    <Form.Label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-upload me-1"></i> Fazer upload de imagem
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={uploadFileHandler}
                    />
                    <Form.Text style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      JPG, PNG, WebP — máx. 5 MB
                    </Form.Text>
                  </Form.Group>

                  {uploading && (
                    <div className="d-flex align-items-center gap-2 mb-2" style={{ color: 'var(--blue-100)', fontSize: '0.85rem' }}>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      Enviando imagem...
                    </div>
                  )}

                  {uploadError && <Message variant="danger">{uploadError}</Message>}

                  {/* URL manual (fallback) */}
                  <Form.Group controlId="image" className="mb-3">
                    <Form.Label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-link me-1"></i> Ou cole uma URL de imagem
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="https://... ou /uploads/produto.jpg"
                      value={image}
                      onChange={(e) => { setImage(e.target.value); setImagePreview(e.target.value); }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <Link to="/admin/productlist" className="btn btn-light">
                  Cancelar
                </Link>
                <Button type="submit" variant="primary" disabled={uploading || loadingUpdate}>
                  <i className="fas fa-save me-2"></i>
                  {loadingUpdate ? 'Salvando...' : 'Salvar Produto'}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default ProductEditScreen;