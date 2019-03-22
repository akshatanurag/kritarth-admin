const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "148.72.88.29",
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
