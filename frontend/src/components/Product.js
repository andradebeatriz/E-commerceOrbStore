import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  const inStock = product.countInStock > 0;

  return (
    <div className="product-card">
      <Link
        to={`/product/${product._id}`}
        style={{ display: 'block', overflow: 'hidden' }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="card-img-top"
        />
      </Link>

      <div className="card-body">
        <Link
          to={`/product/${product._id}`}
          className="text-decoration-none"
        >
          <div className="product-title mb-2">{product.name}</div>
        </Link>

        <div className="mb-2">
          <Rating
            value={product.rating}
            text={`${product.numReviews} avaliações`}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="product-price">
            R$ {product.price.toFixed(2)}
          </span>
          <span className={inStock ? 'badge-stock-in' : 'badge-stock-out'}>
            {inStock ? `${product.countInStock} em estoque` : 'Esgotado'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;