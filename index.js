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
app.use(cors("*"));

const bodyparser = require('body-parser');
app.use(bodyparser.json());

var user = require('./routes/user');
const { Console } = require('console');
const { response } = require('express');

app.use('/', user);
//ㅡㅡㅡㅡㅡㅡ웹 소켓 ㅡㅡㅡㅡㅡㅡ//
const server = require('http').createServer(app).listen(3001, ()=> {
    console.log("포트 3001에 연결되었습니다.")
});
console.log(server)
const options = { 
    cors:true,
    origins:["http://127.0.0.1:3001","*"], };
var users = [];

const io = require('socket.io')(server,options);
io.on('connection', socket=>{
    console.log("connect client by Socket.io", socket.request.connection._peername);
   

    socket.on("user_connected",function(username){
        users[username] = socket.id;
        console.log(users)
        console.log(username)
        io.emit("user_connected",username);
    })


    socket.on('message',function(message){
        console.log('message 이벤트를 받았습니다.');
        console.dir(message);

        if(message.recepient == 'ALL'){
            //나를 포함안 모든 클라이언트에게 메시지 전달
            console.log('나를 포함한 모든 클라이언트에게 message이벤트를 전송합니다.');
            io.sockets.emit('message',message);
        }else {
            //일대일 채팅 대상에게 메시지 전달
            if(login_ids[message.recepient]){
                io.sockets.connected[login_ids[message.recepient]].emit('message',message);

                // 응답 메시지 전송
                sendResponse(socket,'message','200','메시지를 전송했습니다.');
            }else {
                // 응답 메시지 전송
                sendResponse(socket,'login','404','상대방의 로그인 ID를 찾을 수 없습니다.');
            }
        }
    })

    socket.on('room',function(room){
        console.log('방 개설 소켓입니다.')
        console.dir(room)

        if ( room.command == 'create'){
            console.log('방을 새로 만듭니다.');
            socket.join(room.test_id)
            console.log(socket)

            var setting = socket.rooms
            console.log(setting)
        } else if ( room.command == 'join'){
            console.log('방을 들어갑니다.');
            socket.join(room.test_id)

            socket.emit('response',room.test_id)
        }

    })

//     socket.on("first Request", req =>{
//         console.log(req);
//         socket.emit("first Respond",{data: "firstRespond"});
//     });

//     // 로그인 아이디 매핑 (로그인 ID -> 소켓 ID)
//     var login_ids = {};
//     // 'login' 이벤트를 받았을 때의 처리
//     socket.on('login', function(login){
//         console.log('login 이벤트를 받았습니다.');
//         console.dir(login);

//         // 기존 클라이언트 ID가 없으면 클라이언트 ID 를 맵에 추가
//         console.log('접속한 소켓의 ID : ' + socket.id);
//         login_ids[login.id] = socket.id;
//         socket.login_id = login.id;

    
//         console.log('접속한 클라이언트 ID 갯수 : %d', Object.keys(login_ids).length);

//         // 응답 메시지 전송
//         sendResponse(socket, 'login', '200', '로그인되었습니다.');
        
//         function sendResponse(socket, command, code, message) {
//             var statusObj = {command : command, code:code, message : message};
//             socket.emit('response',statusObj);
//         }
//     })

//     socket.on('room',function(room){
//         console.log('room 이벤트를 받았습니다.');
//         if(room.command === 'create') {
//             if(io.sockets.adapter.rooms[room.roomId]) {// 방이 이미 만들어져 있는 경우
//                console.log('방이 이미 만들어져 있습니다.');
//             } else {
//                 console.log('방을 새로 만듭니다.');
//                 socket.join (room.roomId);
//                 socket.join('Test');
//                 socket.join('Test1');
//       function keyValueElement(value, key) {
// console.log(`${key}`);
// console.log('current room id : ' + key)
//                 var outRoom = socket.rooms;
//                 console.log(outRoom)
// }
//                 io.sockets.adapter.rooms.forEach( keyValueElement ) 
           
//                 console.log(io.sockets.adapter.rooms.keys())
//                 var curRoom = io.sockets.adapter.rooms.get(room.roomId);
//                  curRoom.id = room.roomId;
//                  curRoom.name = room.roomName;
//                  curRoom.owner = room.roomOwner; 
                 
//             }
//         } else if(room.command === 'update') {
//              var curRoom = io.sockets.adapter.rooms[room.roomId];
                
//                 curRoom.id = room.roomId;
//                 curRoom.name = room.roomName;
//                 curRoom.owner = room.roomOwner; 
//         } else if(room.command === 'delete' ) {
//             socket.leave(room.roomId);
//             if(io.sockets.adapter.rooms[room.roomId]) {// 방이 만들어져 있는 경우
//                 delete io.sockets.adapter.rooms[room.roomId];
//             } else {
//                 console.log('방이 만들어져 있지 않습니다.')
//             }
//         }

//         var roomList = getRoomList();
 
//         var output = {command : 'list', rooms : roomList};
//         console.log('클라이언트로 보낼 데이터 : ' + JSON.stringify(output));

//         io.sockets.emit('room', output);

//         function getRoomList() {
//             console.dir(io.sockets.adapter.rooms);
//             var roomList = [];
//             Object.keys(io.sockets.adapter.rooms).forEach(function(roomId) { // 각각의 방에 대해 처리
//                 console.log('current room id : ' + roomId)
//                 var outRoom = io.sockets.adapter.rooms[roomId];

//                 // find default room using all attributes
//                 var foundDefault = false;
//                 var index = 0;
//                 Object.keys(outRoom.sockets).forEach(function(key){
//                     console.log('#'+index+' : ' + key + ', ' + outRoom.sockets[key]);

//                     if(roomId == key) {
//                         foundDefault = true;
//                         console.log('this is default room.');
//                     }

//                     index++;
//                 })

//                 if(!foundDefault) {
//                     roomList.push(outRoom);
//                 }
//             })

//             console.log('[ROOM LIST]');
//             console.dir(roomList);

//             return roomList;
//         }
//     })
});


app.listen(3000, ()=>console.log('Express server is running at port no : 3000!'));

