import jwt from 'jsonwebtoken';

// Gera um token JWT contendo o ID do usuário, válido por 30 dias
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
