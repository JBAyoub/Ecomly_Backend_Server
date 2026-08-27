const categoriesRouter = require('express').Router();
const categoriesController = require('../controllers/categoriesController');

categoriesRouter.get('/', categoriesController.getCategories);
categoriesRouter.get('/getCategory/:id', categoriesController.getCategoryById);


module.exports = categoriesRouter;