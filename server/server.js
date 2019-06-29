const express = require('express')
    , volleyball = require('volleyball')
    ,session = require('express-session')
    , mysql = require('mysql')
    , app = express()
    , path = require('path')
    , port =  process.env.PORT || 3000
    , pool = require('./db/connection')


const authRoute = require('./routes/auth')
    , dataRoute = require('./routes/data')
    , dateRoute = require('./routes/date')
    , roomRequestRoute = require('./routes/roomRequest')





const totalRoom = 18 ;
const availableDates = {};

//Dates where you have pending request on room
const pendingDates = {};

//Dates where you are completly booked up 
const nospaceDates = {}


function redirectLogin (req , res , next) {
    if(!req.session.userId){
        res.redirect('/')
    }
    next()
}
function redirectCalender  (req , res , next) {
    console.log("Inside redirect home")

    console.log(req.session.userId)
    if(typeof(req.session.userId) == 'number'){
         res.redirect('/calender')
        console.log(typeof(req.session.userId))
    }
    else{
        next()
    }
    
}

app.use(volleyball)
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    name:"Sid",
    cookie: { 
        sameSite: true
     }
}))

app.get('/' ,  (req , res) =>{

    const {userId} = req.session ; 
     
    res.send(`
    <html>
        <head>
            <title>/Route</title>
        </head>
        <body>
            ${!userId ?
            `<a href="/admin">Manager</a>
            <a href="/User">User</a>
            `
            :
            `<h1>Hello ${req.session.userType} </H1
            <a href="/calender">Calender</a>
            <form method="POST" action="/logout">
                <button>Logout</button>
            </form>`
            }
        </body>
    </html>
`)


    
})

app.get('/user' ,redirectCalender ,  (req , res ) =>{
    res.setHeader("Content-Type", "text/html");
    res.sendFile(path.join(__dirname , '../client/UserLogin.html'));
})

app.get('/admin' ,redirectCalender , (req , res ) =>{
    res.setHeader("Content-Type", "text/html"); 
    res.sendFile(path.join(__dirname , '../client/AdminForm.html'));
})

app.use(`/auth`  ,  authRoute )


app.use('/calender' ,redirectLogin ,express.static('../client'))

app.use('/data' , redirectLogin  ,dataRoute)

app.use('/date'  ,dateRoute)

app.use('/request/room' , roomRequestRoute)

app.get('/check/request' ,(req , res ) =>{
    if(!req.session.userId || req.session.userType == 'user'){
        return res.send("Sorry  you cannot access it ")
    }
    else if(req.session.userType == 'admin'){
        pool.getConnection((err , connection) =>{
            if(err){
                connection.release()
                res.send("Sorry there is a techinal issue please contct again")
            }
            else if(!err){
                connection.query(`SELECT * FROM room_request` , (err , rows , field) =>{
                    res.json(rows)
                })
            }
        })


    }
})

app.listen(port , () =>{
   console.log(`Listening you at http://localhost:${port}`)
})