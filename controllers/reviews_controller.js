// productRouter.post('/:id/reviews', reviewsController.leaveReview);
// productRouter.get('/:id/reviews', reviewsController.getProductReviews);
const Product = require('../models/product');
const Review = require('../models/review');

exports.leaveReview = async function (req, res) {
     try {
          const product = await Product.findById(req.params.productId);
          if (!product) {
               return res.status(404).json({
                    type: "NotFoundError",
                    message: "Product not found"
               });
          }
          const existingReview = await Review.findOne({
               product: req.params.productId,
               user: req.user.id
          });

          if (existingReview) {
               return res.status(409).json({
                    type: "ConflictError",
                    message: "You have already reviewed this product"
               });
          }
          const { rating, comment } = req.body;
          if (!rating || rating < 1 || rating > 5) {
               return res.status(400).json({
                    type: "ValidationError",
                    message: "Rating must be between 1 and 5"
               });
          }
          const review = await Review.create({
               product: product._id,
               user: req.user.id,
               rating,
               comment
          });
          const oldCount = product.numberOfReviews;
          const oldRating = product.rating;
          const newCount = oldCount + 1;
          const newRating =
               ((oldRating * oldCount) + rating) / newCount;
          product.numberOfReviews = newCount;
          product.rating = Number(newRating.toFixed(2));
          await product.save();
          return res.status(201).json({
               message: "Review created successfully!"
          });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
}

exports.getProductReviews = async function (req, res) {
     try {
          const page = Math.max(
               parseInt(req.query.page, 10) || 1,
               1
          );
          const pageSize = Math.min(
               parseInt(req.query.pageSize, 10) || 10,
               100
          );
          const skip = (page - 1) * pageSize;

          const reviews = await Review.find({
               product: req.params.productId
          })
               .populate("user", "name")
               .sort({ date: -1 })
               .skip(skip)
               .limit(pageSize);
          if (!reviews) return res.status(404).json({ message: 'Could not find reviews' });
          return res.json(reviews);
     } catch (error) {
          console.error(error);
          return res.status(500).json({ type: error.name, message: error.message });
     }
}
