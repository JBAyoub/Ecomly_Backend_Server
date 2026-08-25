const usersRoute = require('express').Router();
const userController = require('../controllers/user_controller');


usersRoute.get('/', userController.getUsers);
usersRoute.get('/:id', userController.getUserById);
usersRoute.get('/:id', userController.updateUser);


module.exports = usersRoute;
//to be developped later