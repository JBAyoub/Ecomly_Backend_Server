const bodyParser = require("body-parser");
const cors = require('cors');
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

require('dotenv/config');
const env = process.env;
const app = express();
const api = env.API_URL;



app.use(bodyParser.json())
app.use(morgan("dev"));
app.use(cors());
app.options('/', cors());
app.use(authJwt);
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const authJwt = require("./middlewares/jwt");
app.use(`${api}`, authRouter);
app.use(`${api}/products`, productRouter);
app.listen(env.PORT, env.HOSTNAME, () => {
     console.log(`Server ru at http://${env.HOSTNAME}:${env.PORT}`);
})

mongoose.connect(env.MONGODB_CONNECTION_STRING).then(() => {
     console.log("Connection to database succeded");
}).catch((error) => {
     console.error(error);
})