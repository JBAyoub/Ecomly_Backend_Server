const { User } = require('../models/user')

exports.getUsers = async (req, res) => {
     try {
          if (!req.auth.isAdmin) {
               return res.status(403).json({
                    message: 'Admin access required'
               })
          }
          const users = await User.find().select('name email id isAdmin')
          if (!users) return res.status(404).json({ message: 'Users not found' })
          return res.status(200).json(users)
     } catch (error) {
          console.error(error)

          return res.status(500).json({
               type: error.name,
               message: error.message
          })
     }
}
exports.getUserById = async (req, res) => {
     try {
          const user = await User.findById(req.params.id).select(
               '-passwordHash -resetPasswordOTP -resetPasswordExpires -isAdmin'
          )
          if (!user) return res.status(404).json({ message: 'User not found' });
          return res.status(200).json(user)
     } catch (error) {
          console.error(error)

          return res.status(500).json({
               type: error.name,
               message: error.message
          })
     }
}
exports.updateUser = async (req, res) => {
     try {
          const { email, phone, name } = req.body;
          const user = await User.findByIdAndUpdate(req.params.id, {
               name, email, phone
          }, { new: true });

          if (!user) return res.status(404).json({ message: 'User not found' });
          user.passwordHash = undefined;
          return res.json(user);
     } catch (error) {
          console.error(error)

          return res.status(500).json({
               type: error.name,
               message: error.message
          })
     }


}
