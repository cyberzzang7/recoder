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
        
    }
}