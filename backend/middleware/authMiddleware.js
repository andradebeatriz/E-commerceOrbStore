import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/userModel.js';

// Protege rotas: verifica se existe um token JWT válido no header Authorization
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extrai o token do header "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca o usuário no banco, sem retornar a senha
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Não autorizado, token inválido');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Não autorizado, token não encontrado');
  }
});

// Verifica se o usuário autenticado é administrador
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Não autorizado como administrador');
  }
};

export { protect, admin };
