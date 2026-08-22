const express = require("express");
require('dotenv/config');
const env = process.env;
const app = express();

app.listen(env.PORT,env.HOSTNAME,() => {
     console.log(`Server ru at http://${env.HOSTNAME}:${env.PORT}`);
})


app.use((req,res,next) => {
console.log("A a request has been made to your sever user");
return next();
});
app.use((req,res,next) => {
console.log("A a request has been made to your sever again user 2");
return next();
});


const authorization = (req,res,next) => {
     const isAuthorized = true;
     if(isAuthorized) {
          console.log("user is authorized");
          return next();
     }else {
          return res.status(401).send("you shall not pass user");
     }
};

app.get("/useryou/yoyo/:id", authorization, (req ,res) => {
     return res.json(`there ya go ya little user ${req.params.id}` );
})
app.get("/", (req ,res) => {
     return res.send( "<h1>NIGGERS</h1>");
})