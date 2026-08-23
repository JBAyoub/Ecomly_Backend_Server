exports.login = async function (req,res)  {
     return res.status(200).send("User logged in successfully");
}
exports.register = async function (req,res)  {
     return res.status(200).send("User register  successfully");
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