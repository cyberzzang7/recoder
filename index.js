const express = require('express');
var app = express();
var cors = require('cors');
const con = require('./config/db');
var expressSession = require('express-session');

app.use(expressSession({
    secret: 'my key',          
    resave: true,
    saveUninitialized:true
}));


app.use(cors());

app.use(function(req, res, next) {
    req.con = con
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
})
app.use(cors());


const bodyparser = require('body-parser');
app.use(bodyparser.json());

var user = require('./routes/user');
app.use('/', user);


app.listen(3000, ()=>console.log('Express server is running at port no : 3000!'));

