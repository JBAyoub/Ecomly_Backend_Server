const authRouter = require('express').Router();
const authController = require('../controllers/auth_controller');

authRouter.post("/login", authController.login );
authRouter.post("/register", authController.login);
authRouter.get("/forgot-password", authController.forgotPassword);
authRouter.get("/verify-otp", authController.verifyOtp);
authRouter.get("/reset-password",authController.resetPassword);

module.exports= authRouter;