import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protege rotas que exigem usuário administrador
const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.userLogin);

  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
