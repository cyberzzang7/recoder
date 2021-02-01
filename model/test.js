const bcrypt = require('bcrypt')
const SALT_ROUNDS = 12;
module.exports = {
    stdlogin : function(con, callback) {
        con.con.query("select * from student where s_email=? ",con.body.s_email, callback)
        console.log("학생 로그인")
    },
    tealogin : function(con, callback) {
        con.con.query("select * from teacher where t_email=?", con.body.t_email,callback)
        console.log("선생 로그인")
    },

    signup : function(con, callback) {
        console.log(con.body.type)
        if(con.body.type=="student")
            con.con.query("select * from student where s_email=?", con.body.s_email , callback)
            console.log("학생 회원가입 중복 여부 검사")
        if(con.body.type=="teacher")
            con.con.query("select * from teacher where t_email=?", con.body.t_email , callback)
            console.log("선생 회원가입 중복 여부 검사")
    },

    insertInfo : function(con, callback) {
        if(con.body.type=="student"){
            var stdObj = {
                s_email : con.body.s_email,
                s_name : con.body.s_name,
                s_password : con.body.hashedPassword,
                s_phone : con.body.s_phone,
            };
            console.log("학생 데이터 삽입")
            con.con.query("INSERT INTO student SET ?", stdObj ,callback)
        }
        
        if(con.body.type=="teacher"){
            var teaObj = {
                t_email : con.body.t_email,
                t_name : con.body.t_name,
                t_password : con.body.hashedPassword,
                t_phone : con.body.t_phone,
            };
            console.log("선생 데이터 삽입")
            con.con.query("INSERT INTO teacher SET ?", teaObj ,callback)
        }
        
    },
    classcreate : function(con,callback){
         var classObj = {
                class_code : a,
                t_email : con.body.t_email,
                class_name : con.body.class_name
        };
        con.con.query("INSERT INTO class SET ?",classObj)
        con.con.query("select class_code from class where t_email=?",con.body.t_email,callback)
    
      
    },
    classcodevalidate: function(con,callback){
            var a = Math.floor(Math.random() * 1000000) + 100000;
            if(a>1000000){
                a=a-100000;
            }
            console.log(a)
            var classObj = {
                class_code : a,
                t_email : con.body.t_email,
                class_name : con.body.class_name
            }
        con.con.query("INSERT INTO class SET ?",classObj)
        con.con.query("select * from class where t_email=?",con.body.t_email,callback)
    
    },
    classInfo: function(con,callback){
        
    },
    classList: function(con,callback){
        if ( typeof con.body.s_email == "undefined"){ 
            con.con.query("select * from class where t_email=?",con.body.t_email,callback)
        }
        if ( typeof con.body.t_email == "undefined" ){
            con.con.query("SELECT c.class_num,c.class_name,c.class_name,c.class_code,u.recognize FROM class c LEFT OUTER JOIN user_relation_class u ON c.class_code=u.class_code WHERE u.s_email=?",con.body.s_email,callback)
        }
    },
    classJoin: function(con,callback){
        var classJoin = {
                s_email : con.body.s_email,
                class_code : con.body.class_code,
                recognize : 0
        }
        con.con.query("INSERT INTO user_relation_class SET ?",classJoin,callback)
        // con.con.query(`select distinct class.class_num,class.class_name,student.s_name,class.class_code,user_relation_class.recognize 
        // from class, user_relation_class, student 
        // where class.class_code=user_relation_class.class_code and user_relation_class.s_email=?`,con.body.s_email,callback)
    }, // 쿼리 수정 필요 중복값 많이 나옴. 
    classDelete: function(con,callback){
        let count = 0
        if(con.body.length==1){
            con.con.query("delete from user_relation_class where class_code=?",con.body[0].class_code)
            con.con.query("delete from class where class_code=?",con.body[0].class_code)
        } else {
            for(count =0; con.body.length>count; count++){
                con.con.query("delete from user_relation_class where class_code=?",con.body[count].class_code)
                con.con.query("delete from class where class_code=?",con.body[count].class_code)
            }
        }
         con.con.query("select * from class where t_email=?",con.body[0].t_email,callback)
    },
    userManagement:function(con,callback){
        con.con.query("SELECT s.s_email,s.s_name,u.recognize FROM student s LEFT OUTER JOIN user_relation_class u ON s.s_email=u.s_email WHERE class_code=?",con.body.class_code,callback)
    },
    classRecognize:function(con,callback){
        for(count =0; con.body.length>count; count++){
            con.con.query("UPDATE user_relation_class SET recognize = true WHERE s_email=? and class_code=?",[con.body[count].s_email,con.body[count].class_code]);
        }
        return callback
    },
}