const authRouter = require('express').Router();
const authController = require('../controllers/auth_controller');
const { body } = require('express-validator');

const validateUser = [
     body('name').notEmpty().withMessage('Name is required'),
     body('email').isEmail().withMessage('Please enter a valid email'),
     body('password').isLength({ min: 8 }).withMessage('Password must be atleast 8 characters')
          .isStrongPassword().withMessage('Password must contain atleast 1 Uppercase, 1 symbol'),
     body('phone').isMobilePhone().withMessage('Please enter a valid phone number')
]

const validatePassword = [
     body('newPassword').isLength({ min: 8 }).withMessage('Password must be atleast 8 characters')
          .isStrongPassword().withMessage('Password must contain atleast 1 Uppercase, 1 symbol'),
]

authRouter.post("/login", authController.login);
authRouter.post("/register", validateUser, authController.register);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.get("/verify-token", authController.verifyToken);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/reset-password", validatePassword, authController.resetPassword);

module.exports = authRouter;