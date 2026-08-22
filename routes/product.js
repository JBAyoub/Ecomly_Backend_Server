const productRouter = require("express").Router();
productRouter.get("/count", (req,res) => {
     const count = 256;
     return res.status(200).send(`the count is ${count}`);
})
productRouter.get("/:id", (req,res) => {
     return res.status(200).send(`the user has requested the product with the id  ${req.params.id}`);
})
productRouter.delete("/:id", (req,res) => {
     return res.status(200).send(`the user has requested to delte the product with the id  ${req.params.id}`);
})

module.exports=productRouter;