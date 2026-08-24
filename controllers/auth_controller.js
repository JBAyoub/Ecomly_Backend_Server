const { validationResult } = require('express-validator');
const { User } = require('../models/user');
const { Token } = require('../models/token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');



exports.login = async function (req, res) {
     try {
          const { email, password } = req.body;
          const user = await User.findOne({ email: email });
          console.log(user);
          if (!user) {
               return res.status(404).json({ message: "User not found. Check your Email and try again" });
          }
          if (!bcrypt.compareSync(password, user.passwordHash)) {
               return res.status(400).json({ message: "Incorrect password" });
          }
          const accessToken = jwt.sign(
               { userId: user.id, isAdmin: user.isAdmin },
               process.env.ACCESS_TOKEN_SECRET,
               { expiresIn: '24h' }
          );

          const refreshToken = jwt.sign(
               { userId: user.id, isAdmin: user.isAdmin },
               process.env.REFRESH_TOKEN_SECRET,
               { expiresIn: '60d' }
          );
          const token = await Token.findOne({ userId: user.id });
          if (token) await token.deleteOne();
          await new Token({ userId: user.id, refreshToken, accessToken }).save();
          user.passwordHash = undefined;
          return res.status(200).json({ ...user._doc, accessToken });


     } catch (error) {
          return res.status(500).json({ type: error.name, message: error.message })
     }
}

exports.register = async function (req, res) {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
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
               passwordHash: bcrypt.hashSync(req.body.password, 8)
          })
          user = await user.save();
          if (!user) {
               return res.status(500).json({
                    type: "Internal Server Error",
                    Message: "Could not create user"
               });
          }
          return res.status(200).json(user);
     } catch (error) {
          if (error.message.includes('email_1 dup key')) {
               return res.status(409).json({
                    type: 'AuthError',
                    Message: 'User with that email already exists'
               });
          }
          return res.status(500).json({ type: error.name, message: error.message });
     }
}

exports.verifyToken = async function name(req, res) {
     try {
          let accessToken = req.headers.authorization;
          if (!accessToken) return res.json(false);
          accessToken = accessToken.replace('Bearer', '').trim();

          const token = await Token.findOne(accessToken);
          if (!token) return res.json(false);

          const tokenData = jwt.decode(token.refreshToken);
          const user = User.findById(tokenData.userId);
          if (!user) return res.json(false);

          const isValid = jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET);
          if (!isValid) return res.json(false);
          return res.json(true);
     } catch (error) {
          return res.status(500).json({ type: error.name, message: error.message });
     }

}
exports.forgotPassword = async function (req, res) {
     return res.status(200).send("User forgot-password successfully");
}
exports.verifyOtp = async function (req, res) {
     return res.status(200).send("User verifyOtp  successfully");
}
exports.resetPassword = async function (req, res) {
     return res.status(200).send("User reset-password successfully");
}