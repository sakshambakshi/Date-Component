const route = require('express').Router()
const pool = require('../db/connection')

route.get('/' ,
(req , res , next) =>{ 
    console.log(req.session.userId)
    if(!req.session.userId){
        return res.redirect('/')
    }
    let date = req.query.date.split('/')[2]+'-'+req.query.date.split('/')[0]+'-'+req.query.date.split('/')[1]
    // res.send(date)
    pool.getConnection((err , connection)=>{
        if(err){
            console.log("error @ /date coonection of pool")
            connection.release()
        }
        else {
            connection.query(`SELECT total_room, rooms_booked FROM room_available WHERE date = '${date}'` , (err , rows , fields) =>{
                if(err){
                    console.log("error @ /date coonection of query")
                    connection.release()  
                }
                if(rows.length){
                    const {userType} = req.session 
                    if(rows[0].total_room - rows[0].rooms_booked == 0  ){
                        console.log(req.session)
                            return res.send('No Booking Available For this Day ') 
                    }
                    else{
                        if(userType == 'user'){
                            console.log("Alert")
                            res.setHeader("Content-Type", "text/html")
                            const UserHtml = `<p>We have ${rows[0].total_room - rows[0].rooms_booked} room available on ${date}</p>
                            <p>If you want a room please proceed further </p>
                            <form action="/request/room" method="POST" >
                                <input type="text" placeholder="Type your name" name="name" />
                                <input type="number" placeholder="Number of rooms" name="roomCount" />
                                <input type ="hidden" name="date" value= ${date} />
                                <input type ="hidden" name="userId" value= ${req.session.userId} />
                                <input type ="submit" />
                            </form>`
                            return res.send(UserHtml)
                        }
                    }

                    if(userType == 'admin'){
                        return res.send(`
                            <p>Work under process</p>
                        `)
                    }

                    // else if(rows[0].total_room - rows[0].rooms_booked > 0  &&  rows[0].rooms_booked != 0 ) {
                    //     return res.send(`We have ${rows[0].total_room - rows[0].rooms_booked} rooms available for ${date}`)
                    // }
                    // else if(rows[0].rooms_booked == 0 ){
                    //     return res.send(`We are complely free at ${date}`)
                    // }
                res.send(`The total room are ${rows[0].total_room} and available rooms are ${rows[0].total_room - rows[0].rooms_booked} at the day of ${date}`)
                } else if(rows.length == 0 ) {
                    res.send(`No imformation available of that day to us `)
                }
            })
        }
    })

} )



module.exports = route