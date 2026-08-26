const { CartProduct } = require('../models/cart_product');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order_item');
const { Token } = require('../models/token');
const { User } = require('../models/user');

require('dotenv/config');

exports.getUserCount = async (_, res) => {
     try {
          const userCount = await User.countDocuments();
          if (!userCount) return res.status(500).json({ message: 'Could not count users' });
          return res.json({ userCount });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
}


exports.deleteUser = async (req, res) => {
     try {
          const user = await User.findById(req.params.id);
          if (!user) return res.status(404).json({ message: 'Could not find user' });
          const orders = await Order.find({ user: req.params.id });
          const orderItemsIds = await orders.flatMap(order => order.orderItems);
          await Order.deleteMany({ user: req.params.id });
          await OrderItem.deleteMany({ _id: { $in: orderItemsIds } });
          await CartProduct.deleteMany({ _id: { $in: user.cart } });
          await Token.deleteOne({ userId: req.params.id });
          await User.deleteOne({ _id: req.params.id });
          return res.status(204).json({ message: 'User deleted successfully' });

     } catch (error) {
          console.error(error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
}

