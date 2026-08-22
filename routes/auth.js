const authRouter = require('express').Router();

authRouter.post("/login", (req,res) => {
     return res.status(200).send("User logged in successfully");
});

authRouter.post("/register", (req,res) => {
     return res.status(200).send("User registered successfully");
});

authRouter.get("/logout", (req,res) => {
     return res.status(200).send("User logged out successfully");
});

module.exports= authRouter;