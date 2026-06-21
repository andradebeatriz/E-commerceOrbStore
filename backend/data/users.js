import bcrypt from 'bcryptjs';

// Senhas já criptografadas com bcrypt (hash de "123456")
const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'João Silva',
    email: 'joao@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'Maria Souza',
    email: 'maria@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

export default users;
