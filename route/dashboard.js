const express = require('express');
const middleware = require('../middleware/middleware');
const connection = require('../db/sql')
const router = express.Router();



router.get("/admin/dashboard",middleware.isLoggedIn,async (req,res)=>{
  let sql = `select * from admin where xAuthToken = '${req.session.secure}'`
  await connection.query(sql,async (error,results,fields)=>{
    if (error){
      console.log(error)
      res.status(400).redirect("back");
    }
     else if(results){
      let sql = `select * from users where event_1 = '${results[0].name}' or event_2 = '${results[0].name}' order by payment_status`
      let name = results[0].name
      await connection.query(sql,(error,results,fields)=>{
        if(error){
          console.log(error)
          res.status(400).redirect("back")
        }
        else if(results){
          res.render("index",{
              username: name,
              data: results
          })
        }
      })
     }
    





    })
});

router.get("/admin/event/:eventID",middleware.isLoggedIn, async (req, res)=>{
  let paidCount = 0;
  let eventIdCheck = (req.user.dept_id - 1) * 100;
  let data = {
      id: req.user.dept_id,
      event: [],
      deptName: "",
      eventName: "",
    }

  if( req.params.eventID > eventIdCheck + 20 || req.params.eventId < eventIdCheck) {
    res.send("404 not found");
    return;
  };

  await connection.query(`select * from common_school where id=${req.user.dept_id}`, (error, results, fields) => {
    data.deptName = results[0].name;
  });

  let sql = `select * from events where Id=${req.params.eventID}`;

  await connection.query(sql, (error, results, fields) => {
    data.eventName = results[0].event_name;
  });

  let eventSql = `select * from participants_participant_events inner join participants_participant on participants_participant.kf_id=participants_participant_events.participant_id where event_id=${req.params.eventID}`;


  await connection.query(eventSql, (error, results, fields) => {
    for(let i = 0; i < results.length;  i++){
      data.event.push({
        id: results[i].participant_id,
        name: results[i].name,
        email: results[i].email,
        phone: results[i].phone,
        isPaid : results[i].payment_complete
      });
      if(results[i].payment_complete == 1)
        paidCount++
    }

    let total = results.length;
    res.render("main", {
      id: req.params.eventID,
      data,
      paidCount,
      total,
      });
  });

});

router.get("/admin/event/download/:eventID", middleware.isLoggedIn, async (req, res) => {
  let allcsv = [];
  allcsv.push(['KFId','Name','Email','Phone','Payment done']);
  let csvContent;


  let eventSql = `select * from participants_participant_events inner join participants_participant on participants_participant.kf_id=participants_participant_events.participant_id where event_id=${req.params.eventID}`;


  await connection.query(eventSql, async (error, results, fields) => {
    for(let i = 0; i < results.length;  i++) {
      let current = results[i];
      allcsv.push([current.participant_id, current.name, current.email, current.phone, current.payment_complete]);
      
    }
    await allcsv.forEach( e => {
      var dataString = e.join(",");
      csvContent += dataString + "\n";
    });
    await res.header({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=eventDetails.csv'
    }).send(new Buffer(csvContent));
  });

});



// router.get("/all-participants",async (req,res)=>{
//   let sql = `select * from participants_participant_events where dep_id=${req.user.dept_id}`;
//   await connection.query(sql, (error, results, fields) => {
//     res.render("view-all",{
//       kf_id: results[0].participant_id
//     })
//   });


// })

module.exports = router;
