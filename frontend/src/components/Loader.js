import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <Spinner
        animation="border"
        role="status"
        style={{
          width: '80px',
          height: '80px',
          margin: 'auto',
        }}
      >
        <span className="visually-hidden">Carregando...</span>
      </Spinner>
    </div>
  );
};

export default Loader;
