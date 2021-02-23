const express = require('express');
var app = express();
var cors = require('cors');
const con = require('./config/db');

app.use(function(req, res, next) {
    req.con = con;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
app.use(cors());

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var user = require('./routes/user');
app.use('/', user);

//ㅡㅡㅡㅡㅡㅡ웹 소켓 ㅡㅡㅡㅡㅡㅡ//



app.listen(3000, ()=>console.log('Express server is running at port no : 3000!'));

