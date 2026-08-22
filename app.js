const express = require("express");
require('dotenv/config');
const env = process.env;
const app = express();

app.listen(env.PORT,env.HOSTNAME,() => {
     console.log(`Server running at http://${env.HOSTNAME}:${env.PORT}`);
})