import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protege rotas que exigem usuário autenticado
const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.userLogin);

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
