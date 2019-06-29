const route = require('express').Router()
const pool = require('../db/connection')




route.post('/' , (req , res ,) =>{
    if(!req.session.userId){
        return res.send('You can Use this route') 
    }
    if(req.session.userType == 'admin'){
        return res.send('Admin cannot request room')
    }
    const {name , roomCount , date , userId} = req.body
    console.log(req.body)
    // return res.send(`INSERT INTO room_Request ( name, room_requested, request_date , userId) VALUES ( '${name}' , ${roomCount} , '${date}' , ${userId}  )`)
    
    pool.getConnection((err , connection) =>{
        if(err){
            connection.release()
            console.log("Error at room request pool")
        }
        else {
           connection.query(`INSERT INTO room_Request ( name, room_requested, request_date , userId) VALUES ( '${name}' , ${roomCount} , '${date}' , ${userId}  )` , (err , rows , field) =>{
            connection.release();
               if(err){
                  return res.send("Could not file your request try after some time")
               } 
               else {
                   return res.send('Your request is submitted')
               }
           })
        }
    })
    
})


module.exports = route