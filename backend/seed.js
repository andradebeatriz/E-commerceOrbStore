import dotenv from 'dotenv';
import connectDB from './config/db.js';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();

await connectDB();

// Importa os dados de exemplo para o banco de dados
const importData = async () => {
  try {
    // Limpa as coleções existentes
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insere os usuários de exemplo
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Associa o usuário admin como criador de cada produto
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Dados importados com sucesso!');
    process.exit();
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
};

// Remove todos os dados do banco
const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Dados removidos com sucesso!');
    process.exit();
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
