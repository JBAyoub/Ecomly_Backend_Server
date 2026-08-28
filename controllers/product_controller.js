const Product = require('../models/product')
exports.getProducts = async function (req, res) {
     try {
          let products;
          const page = req.query.page || 1
          const pageSize = 10

          let query = {}
          if (req.query.criteria) {
               if (req.query.category) {
                    query['category'] = req.query.category
               }
               switch (req.query.criteria) {
                    case 'newArrivals': {
                         twoWeeksAgo = new Date()
                         twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
                         query['dateAdded'] = { $gte: twoWeeksAgo }
                         break
                    }
                    case 'Popular': {
                         query['rating'] = { $gte: 4.5 }
                         break
                    }
                    default:
                         break
               }

               products = await Product.find(query)
                    .select('-images -reviews -size')
                    .skip((page - 1) * pageSize)
                    .limit(pageSize);
          } else if (req.query.category) {
               products = await Product.find({ category: req.query.category })
                    .select('-images -reviews -size')
                    .skip((page - 1) * pageSize)
                    .limit(pageSize);
          } else {
               products = await Product.find()
                    .select('-images -reviews -size')
                    .skip((page - 1) * pageSize)
                    .limit(pageSize);;
          }
          if (!products) return res.status(404).json({ message: 'Could not find any products' });
          return res.json(products);

     } catch (error) {
          console.error(error)
          return res.status(500).json({
               type: error.name,
               message: error.message
          })
     }
}

exports.searchProducts = async function (req, res) {
     try {
          const searchTerm = req.query.q?.trim();
          if (!searchTerm) {
               return res.status(400).json({
                    type: "ValidationError",
                    message: "Search term is required"
               });
          }
          // Which page?
          const page = Math.max(
               parseInt(req.query.page, 10) || 1,
               1
          );
          // How many products per page?
          const pageSize = Math.min(
               Math.max(
                    parseInt(req.query.pageSize, 10) || 10,
                    1
               ),
               100
          );
          // How many products should MongoDB skip?
          const skip = (page - 1) * pageSize;

          // What are we searching for?
          const filter = {
               name: {
                    $regex: searchTerm,
                    $options: "i"
               },
               description: {
                    $regex: searchTerm,
                    $options: "i"
               }
          };
          const products = await Product.find(filter)
               .skip(skip)
               .limit(pageSize);

          return res.status(200).json({
               products
          });

     } catch (error) {
          console.error("searchProducts:", error);
          return res.status(500).json({
               type: "InternalServerError",
               message: "Something went wrong with the product search"
          });
     }
}

exports.getProductById = async function (req, res) {

     try {
          const product = await Product.findById(req.params.id);
          if (!product) return res.status(404).json({
               type: "NotFoundError",
               message: "Could not find product"
          });
          return res.json(product);

     } catch (error) {
          if (error.name === "CastError") {
               return res.status(400).json({
                    type: "ValidationError",
                    message: "Invalid product ID"
               });
          }
          console.error("getProductById:", error);
          return res.status(500).json({
               type: "InternalServerError",
               message: "Could not fetch product"
          });
     }
}
