const route = require('express').Router()
const pool = require('../db/connection')

const availableDates = {};
const pendingDates = {};
const nospaceDates = {}

route.get('/' , (req , res , next) =>{
    console.log("Inside Data ")
    pool.getConnection((err , connection) =>{
        if(err){
            console.log("err @ getConnection");
            connection.release()
        }
        connection.query(`SELECT * FROM room_available` , (err , rows , field) =>{
            // let date = rows[0].date.toString();
            if(err){
                console.log("err @ getConnection");
                connection.release()
            }
            rows.forEach(row => {

                if(row.total_room === row.rooms_booked){
                console.log("Fully Booked")
                let date = new Date(row.date.toString());
                date = date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear();
                nospaceDates[date] = date ;
                }
                else if(row.rooms_booked == 0 ){
                    let date = new Date(row.date.toString());
                    date = date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear();
                    availableDates[date] = date
                }
                else if(row.rooms_booked > 0 && row.rooms_booked < row.total_room) {
                    let date = new Date(row.date.toString());
                    date = date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear();
                    pendingDates[date] = date ;
                    pendingDates[date].booked = row.rooms_booked ;
                }
                console.log({availableDates , pendingDates , nospaceDates})   
            });
            connection.release()
            res.send({
                availableDates: availableDates , pendingDates : pendingDates , nospaceDates :nospaceDates
                })
            
                    
        })
    })

})


module.exports = route 