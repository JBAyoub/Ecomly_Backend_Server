const bodyParser = require("body-parser");
const cors = require('cors');
const express = require("express");
const morgan = require ("morgan");

require('dotenv/config');
const env = process.env;
const app = express();

app.use(bodyParser.json())
app.use(morgan);
app.use(cors());
app.options('/', cors());

app.listen(env.PORT,env.HOSTNAME,() => {
     console.log(`Server ru at http://${env.HOSTNAME}:${env.PORT}`);
})
app.get("/useryou/yoyo/:id", (req ,res) => {
     return res.json(`there ya go ya little user ${req.params.id}` );
})
app.get("/", (req ,res) => {
     return res.send( "<h1>NIGGERS</h1>");
})