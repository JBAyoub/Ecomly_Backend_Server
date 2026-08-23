const productRouter = require("express").Router();
const productsControllers= require('../controllers/product_controller');
productRouter.get("/count", (req,res) => {
     productsControllers.productsCountController(req,res);
});
productRouter.get("/:id", (req,res) => {
     productsControllers.productDetailController(req,res);
})
productRouter.delete("/:id", (req,res) => {
     return res.status(200).send(`the user has requested to delte the product with the id  ${req.params.id}`);
})

module.exports=productRouter;