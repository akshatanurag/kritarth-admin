const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require("../db/sql")
// const swal =  require('sweetalert');

module.exports = {
  isLoggedIn: async function (req,res,next){
    const token = req.session.secure;
    if(!token)
      return res.status(401).send('Access denied');
    try {
      let sql = `select xAuthToken from admin where xAuthToken='${token}'`
      await connection.query(sql,(error,results,fields)=>{
        if (error){
          console.log(error)
          console.log("error occured1");
          res.status(400).redirect("back");
        }
        if (results){
          //console.log(results)
          if (results[0].xAuthToken == token) {
            next()
          } else {
              console.log("error");
              res.status(204).redirect("back");
          }
        } else {
          console.log("error occured");
          res.status(400).redirect("/admin/login");
        }
      })
    } catch (error) {
      console.log(error);
      res.status(400).send('Invalid Token');
    }

  },
  // isAdmin: function(req,res,next){
  //   // console.log(req.user.username)
  //   if(!req.user.is_staff)
  //     // swal({
  //     //     title: "Are you sure?",
  //     //     text: "Are you sure that you want to leave this page?",
  //     //     icon: "warning",
  //     //     dangerMode: true,
  //     // })
  //     return res.status(403);
  //   next();
  // }
};


