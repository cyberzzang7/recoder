const mysql = require("mysql")
require("dotenv").config()

module.exports = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

module.exports.connect((err)=>{
    if(!err)
        console.log('DB connection succeded.');

    else
    console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
    console.log(process.env.DB_HOST);
    console.log(process.env.DB_USER);
    console.log(process.env.DB_PASSWORD);
    console.log(process.env.DB_NAME);
});