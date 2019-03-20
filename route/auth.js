const express = require("express")
const middleware = require("../middleware/middleware")
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const swal =  require('sweetalert');
const config= require('config');

const connection = require("../db/sql")

const router = express.Router();

 /* LOGIN ROUTES */
 router.get("/admin/login",(req, res) => {
    res.render("login");
  });

  // router.get("/admin/dashboard",[middleware.isLoggedIn,middleware.isAdmin],(req,res)=>{
  //   res.render("index");
  // })

  
  router.post("/admin/login", async (req, res) => {
    try {
      let username = req.body.username;
    let password = await crypto
      .createHash("md5")
      .update(req.body.pass)
      .digest("hex");
    let sql = "select * from admin where name = ?";


    /*--------------------------------
     FUCNTION FOR GENERATING AUTH TOKEN 
    -----------------------------------*/

      // generateAuthToken = function(){
      //   return jwt.sign({
      //     username: req.body.username,
      //     dept_id: 3
      //   },config.get('jwtPrivateKey'));
      // }
     // console.log(generateAuthToken());

    await connection.query(sql, [username], (error, results, fields) => {
      if (error){
        console.log(error)
        console.log("error occured1");
        res.status(400).redirect("back");
      }
      
      else if (results){
        if (results[0].password == password) {
          // res.setHeader('x-auth-token', token);
          req.session.secure = results[0].xAuthToken;
          res.redirect("/admin/dashboard")
        } else {
            console.log("error");
            res.status(204).redirect("back");
        }
      } else {
        console.log("error occured");
        res.status(400).redirect("/admin/login");
      }
    });
    } catch (error) {
      res.status(400).send('Worng username or password')
    }
    
  });
  
  router.get("/admin/logout",middleware.isLoggedIn,(req,res)=>{
    res.header('x-auth-token',null).status(200).redirect("/admin/login")
  })

  module.exports = router;
