const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "http://kritarth.org/comingsoon/phpmyadmin",
    user: "mvhu5p2y1vz4",
    password: "Kritarth@2019#",
    database: "kritarth"
  });
  connection.connect(err => {
    
    if(err)
    console.log(err)
    else 
    console.log("Connected to db");
    return;
  });

  module.exports = connection
