const express = require('express');
var app = express();
var cors = require('cors');
const con = require('./config/db');

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
//ㅡㅡㅡㅡㅡㅡ웹 소켓 ㅡㅡㅡㅡㅡㅡ//
const server = require('http').createServer(app).listen(3001, ()=> {
    console.log("포트 3001에 연결되었습니다.")
});

const options = { 
    cors:true,
    origins:["http://127.0.0.1:3001"], };

const io = require('socket.io')(server,options);
io.on('connection', socket=>{
    console.log("connect client by Socket.io", socket.request.connection._peername);
    

    socket.on("first Request", req =>{
        console.log(req);
        socket.emit("first Respond",{data: "firstRespond"});
    });
});


app.listen(3000, ()=>console.log('Express server is running at port no : 3000!'));

