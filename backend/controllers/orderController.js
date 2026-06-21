import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Criar novo pedido
// @route   POST /api/orders
// @access  Privado
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Nenhum item no pedido');
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      res.status(404);
      throw new Error(`Produto não encontrado: ${item.product}`);
    }

    // Verifica se há estoque suficiente
    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(
        `Estoque insuficiente para ${product.name}. ` +
        `Disponível: ${product.countInStock}, Solicitado: ${item.qty}`
      );
    }

    // Atualiza o estoque
    product.countInStock = product.countInStock - item.qty;
    await product.save();
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Buscar pedido por ID
// @route   GET /api/orders/:id
// @access  Privado
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado');
  }
});

// @desc    Atualizar pedido para pago
// @route   PUT /api/orders/:id/pay
// @access  Privado
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || 'PAGAMENTO-SIMULADO',
      status: req.body.status || 'COMPLETO',
      update_time: req.body.update_time || Date.now().toString(),
      email_address: req.body.email_address || req.user.email,
      
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado');
  }
});

// @desc    Atualizar pedido para entregue
// @route   PUT /api/orders/:id/deliver
// @access  Privado/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado');
  }
});

// @desc    Buscar pedidos do usuário logado
// @route   GET /api/orders/myorders
// @access  Privado
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Buscar todos os pedidos
// @route   GET /api/orders
// @access  Privado/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
