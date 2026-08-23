const {validationResult} = require('express-validator');
const { User } = require('../models/user');
const { default: bcrypt } = require('bcryptjs');


exports.login = async function (req,res)  {
     return res.status(200).send("User logged in successfully");
}

exports.register = async function (req,res)  {
     const errors= validationResult(req);
     if (!errors.isEmpty()){
          const errorMessages = errors.array().map((error) => ({
               field: error.path,
               message: error.msg
          }));
         
          res.status(400).json({
               errors: errorMessages
          });
     }
try {
     let user = new User({
          ...req.body,
          passwordHash: bcrypt.hashSync(req.body.password,8)
     })
     user = await user.save();
     if (!user){
          return res.status(500).json({
               type:"Internal Server Error",
               Message:"Could not create user"        
          });
     }
     return res.status(200).json(user);
} catch (error) {
     return res.status(500).json({type:error.name, message: error.message});
}
}
exports.forgotPassword = async function (req,res)  {
     return res.status(200).send("User forgot-password successfully");
}
exports.verifyOtp = async function (req,res)  {
     return res.status(200).send("User verifyOtp  successfully");
}
exports.resetPassword = async function (req,res)  {
     return res.status(200).send("User reset-password successfully");
}