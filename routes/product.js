const productRouter = require("express").Router();
const productsController = require('../controllers/product_controller');
const reviewsController = require('../controllers/reviews_controller');
productRouter.get('/', productsController.getProducts);
productRouter.get("/search", productsController.searchProducts);
productRouter.get("/:id", productsController.getProductById);
productRouter.post('/:id/reviews', reviewsController.leaveReview);
productRouter.get('/:id/reviews', reviewsController.getProductReviews);

module.exports = productRouter;