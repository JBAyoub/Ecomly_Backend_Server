const bodyParser = require("body-parser");
const cors = require('cors');
const express = require("express");
const morgan = require ("morgan");
const mongoose= require ("mongoose");

require('dotenv/config');
const env = process.env;
const app = express();



app.use(bodyParser.json())
app.use(morgan("dev"));
app.use(cors());
app.options('/', cors());
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
app.use(authRouter);
app.use("/products",productRouter);
app.listen(env.PORT,env.HOSTNAME,() => {
     console.log(`Server ru at http://${env.HOSTNAME}:${env.PORT}`);
})

mongoose.connect(env.MONGODB_CONNECTION_STRING).then(() => {
     console.log("Connection to database succeded");
}).catch((error) => {
     console.error(error);
})