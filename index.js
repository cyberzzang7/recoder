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

//ㅡㅡㅡㅡㅡㅡ웹 소켓 ㅡㅡㅡㅡㅡㅡ//

const server = require('http').createServer(app).listen(3001, ()=> {
    console.log("포트 3001에 연결되었습니다.")
});

const options = { 
cors:true,
    origins:["http://127.0.0.1:3001","*"], };
var users = [];

const io = require('socket.io')(server,options);
var so = require('./socket/socket');

io.on('connection', socket=>{
    console.log("connect client by Socket.io", socket.request.connection._peername);
   
    so.test(async(err,rows)=>{
         return rows
    });
    socket.on("user_connected",function(username){
      
        users[username] = socket.id;
        console.log(users)
        console.log(username)
        io.emit("user_connected",username);
    })
})
