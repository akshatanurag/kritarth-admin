const express = require('express');
const bodyParser = require("body-parser");
require("ejs");


const session = require("express-session");
const config = require('config');


const authRoutes = require("./route/auth");
const dashboardRoutes = require('./route/dashboard');

var app = express();
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "vffdvfdhjkvbsdjfvbjsdbcjhdasgchjadsgchjadshcs",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1); // trust first proxy


if(!config.get('jwtPrivateKey')){
  console.log("FATAL ERROR: jwtPrivateKey not defined");
  process.exit(1);
}


app.use(authRoutes);
app.use(dashboardRoutes);

app.get("/",(req,res)=>{
  res.send("Welcome");
});


var port = process.env.PORT || 3030;

app.listen(port,process.env.IP,()=>{
  console.log(`Server is up on ${port}`);
});
