import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Buscar todos os produtos (com pesquisa e paginação)
// @route   GET /api/products
// @access  Público
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  // Filtro de pesquisa por palavra-chave (busca pelo nome do produto)
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Buscar um produto por ID
// @route   GET /api/products/:id
// @access  Público
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

// @desc    Excluir produto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Produto removido com sucesso' });
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Privado/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = new Product({
    name: name || 'Nome de exemplo',
    price: price || 0,
    user: req.user._id,
    image: image || '/images/sample.jpg',
    brand: brand || 'Marca de exemplo',
    category: category || 'Categoria de exemplo',
    countInStock: countInStock || 0,
    numReviews: 0,
    description: description || 'Descrição de exemplo',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Atualizar um produto existente
// @route   PUT /api/products/:id
// @access  Privado/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = image ?? product.image;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.countInStock = countInStock ?? product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

// @desc    Criar uma nova avaliação para o produto
// @route   POST /api/products/:id/reviews
// @access  Privado
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Verifica se o usuário já avaliou este produto
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Produto já avaliado por este usuário');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Avaliação adicionada com sucesso' });
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
