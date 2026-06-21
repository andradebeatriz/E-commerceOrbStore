import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listUsers, deleteUser } from '../actions/userActions';
import { AdminSidebar } from './DashboardScreen';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <Row>
      <Col md={3} className="mb-4">
        <AdminSidebar />
      </Col>

      <Col md={9}>
        <h1>Usuários</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {user._id}
                  </td>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`} style={{ color: 'var(--blue-100)' }}>
                      {user.email}
                    </a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <span className="badge-stock-in">
                        <i className="fas fa-check me-1"></i>Admin
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        <i className="fas fa-times me-1"></i>Usuário
                      </span>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm me-2">
                        <i className="fas fa-edit me-1"></i>Editar
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className="fas fa-trash me-1"></i>Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default UserListScreen;