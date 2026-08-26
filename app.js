const bodyParser = require("body-parser");
const cors = require('cors');
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authJwt = require("./middlewares/jwt");
const errorHandler = require("./middlewares/error_handler");
require('dotenv/config');
const env = process.env;
const app = express();
const api = env.API_URL;


app.use(bodyParser.json())
app.use(morgan("dev"));
app.use(cors());
app.options('/', cors());
app.use(authJwt());
app.use(errorHandler);

const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const usersRouter = require('./routes/users');
const adminRouter = require("./routes/admin");

app.use(`${api}`, authRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/admin`, adminRouter);
app.use(`${api}/products`, productRouter);
app.use('/public', express.static(__dirname + '/public'));

app.listen(env.PORT, env.HOSTNAME, () => {
     console.log(`Server ru at http://${env.HOSTNAME}:${env.PORT}`);
})

mongoose.connect(env.MONGODB_CONNECTION_STRING).then(() => {
     console.log("Connection to database succeded");
}).catch((error) => {
     console.error(error);
})