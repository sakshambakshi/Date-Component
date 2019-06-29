// 127.0.0.1:27017

// const monk = require('monk');
// const db = monk('http://localhost:27017/auth-for-noobs');

const mysql = require('mysql'); 
 
const pool = mysql.createPool({
    connectionLimit: 10, //important
    host: 'localhost',
    user: 'root',
    database: 'hotel_booking',
    debug: false
});


module.exports = pool ; 