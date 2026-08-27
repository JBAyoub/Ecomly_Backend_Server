const express = require('express');
const adminRouter = express.Router();

const usersController = require('../controllers/admin/users');
const categoryController = require('../controllers/admin/categories');
adminRouter.get('/users/count', usersController.getUserCount);
adminRouter.delete('/users/:id', usersController.deleteUser);

// CATEGORIES
// adminRouter.post('/categories', categoryController.addCategory);
// adminRouter.put('/categories/:id', categoryController.editCategory);
// adminRouter.delete('/categories/:id', categoryController.deleteCategory);

// PRODUCTS
// adminRouter.get('/products/count', adminController.getProductsCount);
// adminRouter.post('/products', adminController.addProduct);
// adminRouter.put('/products/:id', adminController.editProduct);
// adminRouter.delete('/products/:id/images', adminController.deleteProductImages);
// adminRouter.delete('/products/:id', adminController.deleteProduct);

// ORDERS
// adminRouter.get('/orders', adminController.getOrders);
// adminRouter.get('/orders/count', adminController.getOrdersCount);
// adminRouter.put('/orders/:id', adminController.changeOrderStatus);

module.exports = adminRouter;