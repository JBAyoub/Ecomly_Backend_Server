const userRoute = require('express').Router();
const userController = require('../controllers/user_controller');


userRoute.get('/', userController.getUsers);
userRoute.get('/:id', userController.getUserById);
userRoute.get('/:id', userController.updateUser);

//to be developped later