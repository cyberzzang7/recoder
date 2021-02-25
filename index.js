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


app.listen(3000, ()=>console.log('Express server is running at port no : 3000!'));

//ㅡㅡㅡㅡㅡㅡ웹 소켓 ㅡㅡㅡㅡㅡㅡ//

const server = require('http').createServer(app).listen(3001, ()=> {
    console.log("포트 3001에 연결되었습니다.")
});

const options = { 
cors:true,
    origins:["http://3.89.30.234:3001","*"], };
var users = [];

const io = require('socket.io')(server,options);
var so = require('./socket/socket');

io.on('connection', socket=>{
    console.log("connect client by Socket.io", socket.request.connection._peername, socket.id);
   
    so.test(async(err,rows)=>{
         return rows
    });
    socket.on("create",function(create){
        console.log(create.test_id);
        socket.join(create.test_id);
        console.log(io.sockets.adapter.rooms)
        io.to(create.test_id).emit('create',"방이 개설 되었습니다.");
    
                var curRoom = io.sockets.adapter.rooms.get(create.test_id);
                
                 curRoom.test_id = create.test_id;
                 curRoom.t_email = create.t_email;
                 console.log(curRoom)
    })
    
    socket.on("join",function(join){
        console.log(join)
        console.log(join.s_email);
        socket.join(join.test_id);
        // console.log(io.sockets.adapter.rooms.get(join.test_id.get(join.t_email)))
        io.to(join.test_id).emit('student_join','학생 입장!');
    })
})
