const route = require('express').Router()
const db = require('../db/connection')

route.post('/' , (req , res , next) =>{
    if(req.session.userId){
        return res.redirect('/calender')
    }
    const {username} = req.body ;
    const {password} = req.body ;
    const {type} = req.body 

    if(username , password , type ){
        console.log({username , password , type })
        if(type == 'user'){
            //Than the normal user have login 
            db.getConnection((err , connection)=>{
                if(err){
                    console.log(err)
                    connection.release()
                }
                else{
                    connection.query(`SELECT * FROM user WHERE email = '${username}' ` ,(err , rows) =>{
                        if(err){
                            connection.release()
                            return res.send(`SELECT * FROM 'user' WHERE email = '${username}' AND password = '${password}'`)
                        }
                        if(rows.length > 0){
                            req.session.userId = rows[0].id;
                            req.session.userType = type;
                            connection.release()
                            return res.redirect('/calender')
                        }
                        else{
                            connection.release()
                            return res.send("Username and Password combination is not correct")
                        }
                    })
                }

            })
        }
        else if(type == 'admin'){
            db.getConnection((err , connection)=>{
                if(err){
                    console.log(err)
                    connection.release()
                }
                else{
                    connection.query(`SELECT * FROM manager WHERE email = '${username}' ` ,(err , rows) =>{
                        if(err){
                            connection.release()
                            return res.send(`Something Went wrong`)
                        }
                        if(rows.length > 0){
                            req.session.userId = rows[0].id;
                            req.session.userType = type;
                            connection.release()
                            return res.redirect('/calender')
                        }
                        else{
                            connection.release()
                            return res.send("Username and Password combination is not correct !! Manager")
                        }
                    })
                }

            })
        }
    }

})

module.exports = route



