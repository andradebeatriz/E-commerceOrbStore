import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @desc    Obter estatísticas gerais para o dashboard administrativo
// @route   GET /api/admin/summary
// @access  Privado/Admin
const getDashboardSummary = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalProducts = await Product.countDocuments({});
  const totalOrders = await Order.countDocuments({});

  const orders = await Order.find({ isPaid: true });
  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
  });
});

export { getDashboardSummary };
