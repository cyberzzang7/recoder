const express = require('express');
var app = express();
var cors = require('cors');
const con = require('./config/db');
const test = require('./model/test');

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
    origins:["http://127.0.0.1:3001","*"], };
var users = [];

const io = require('socket.io')(server,options);
var so = require('./socket/socket');

io.on('connection', socket=>{
    console.log("connect client by Socket.io", socket.request.connection._peername, socket.id);
   
        socket.on("create",function(create){
            console.log(create.test_id);
            socket.join(create.test_id);
            console.log(io.sockets.adapter.rooms)
            io.to(create.test_id).emit('create',"시험 방이 열렸습니다.");
    
                var curRoom = io.sockets.adapter.rooms.get(create.test_id);
                
                 curRoom.test_id = create.test_id;
                 curRoom.t_email = create.t_email;
                 console.log(curRoom)
        })
    
        socket.on("join",function(join){
            console.log(join)
            join.con=con
            console.log(join.s_email);
            socket.join(join.test_id);
            console.log(io.sockets.adapter.rooms)
            test.snumber(join,async(err,rows)=>{
                if(err){
                    console.log(err)
                }
                console.log(rows)
                io.to(join.test_id).emit('student_join',rows[0]);
            })
        // console.log(io.sockets.adapter.rooms.get(join.test_id.get(join.t_email)))
        })

        socket.on("room_out",function(roomout){
            console.log(roomout.test_id);
            console.log("유저가 방을 나갑니다.")
            socket.leave(roomout.test_id);
            console.log(io.sockets.adapter.rooms.get(roomout.test_id))
            io.to(roomout.test_id).emit('room_out',"시험이 종료되고 방을 나갑니다.");    
        })
        socket.on("m_room_out",function(m_roomout){
            console.log(m_roomout);
            
            console.log("선생님이 방을 나갑니다.")
           
            socket.leave(m_roomout.test_id);
            console.log(io.sockets.adapter.rooms.get(m_roomout.test_id))
            io.to(m_roomout.test_id).emit('m_room_out',{manager:false});
        })

        socket.on("eyetracking", function(data){
            data.con=con
            test.eyeTracking(data,async(err,rows)=>{
                if(err){
                    console.log(err)
               
                }
                console.log(rows)
            io.to(data.test_id).emit('eyetrackingcount',rows[0])
            })
        })
        socket.on("volumeMeter",function(data){
            console.log(data)
            data.con=con
            test.volumeMeter(data,async(err,rows)=>{
                if(err){
                    console.log(err)
                }
                console.log(rows)
                io.to(data.test_id).emit('volumeMeter',rows[0])
            })
        })
})

