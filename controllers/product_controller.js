exports.productsCountController = (req,res) => {
     const count = 233;
     return res.status(203).send(`the product count is ${count}`)
}
exports.productDetailController = (req,res) => {
     return res.status(200).send(`the user has requested the product with the id  ${req.params.id}`);
}