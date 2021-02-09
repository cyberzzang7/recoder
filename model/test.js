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
        if ( typeof con.body.s_email == "undefined"){ 
            con.con.query("SELECT t.test_id,t.test_name, (select count(*) from test_relation_question where test_id=t.test_id) as questioncount ,date_format(t.test_start, '%Y-%m-%d %H:%i:%s') as test_start,date_format(t.test_end, '%Y-%m-%d %H:%i:%s') as test_end,t.t_test_status FROM test t WHERE t.class_code=?",con.body.class_code,callback)
        }
        if ( typeof con.body.t_email == "undefined"){

        }
    },
    examDelete: function(con,callback){
        con.con.query("delete from test_relation_question where test_id=?",con.body.test_id)
        con.con.query("delete from test where test_id=?",con.body.test_id,callback)
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
        console.log(con.body.length)
        console.log(con.body[0].s_email)
        console.log(con.body[0].class_code)
        for(let count=0; con.body.length>count; count++){
            con.con.query("UPDATE user_relation_class SET recognize = true WHERE s_email=? and class_code=?",[con.body[count].s_email,con.body[count].class_code]);
        }
        con.con.query("select * from user_relation_class",callback)
    },
    examCreate:function(con,callback){
        var examInfo = {
                class_code : con.body[0].class_code,
                test_name : con.body[0].test_name,
                test_start : con.body[0].test_start,
                test_end : con.body[0].test_end,
                test_wait : con.body[0].test_wait,
                test_caution : con.body[0].test_caution,
                test_retake : con.body[0].test_retake,
                test_shuffle : con.body[0].test_shuffle,
                test_escape : con.body[0].test_escape,
                test_lang : con.body[0].test_lang,
                s_test_status : 1,
                t_test_status : 1,
        }
        con.con.query("INSERT INTO test SET ?",examInfo)
        
        for(let count=1; con.body.length>count; count++){
            con.con.query("select max(test_id) as test_id from test",function(err,rows){
                 var questionInfo = {
                    question_name : con.body[count].question_name,
                    question_score : con.body[count].question_score,
                    question_text : con.body[count].question_text
                }
                con.con.query("INSERT INTO question SET ?",questionInfo)
                con.con.query("select max(question_id) as question_id from question",function(err,rowss){
                    var test_relation_question= {
                        test_id : rows[0].test_id,
                        question_id : rowss[0].question_id
                    }
                    console.log(rowss[0].question_id)
                    con.con.query("INSERT INTO test_relation_question set ?",test_relation_question)
                })
            })
        }
    con.con.query("SELECT t.test_id,t.test_name, (select count(*) from test_relation_question where test_id=t.test_id) as questioncount ,date_format(t.test_start, '%Y-%m-%d %H:%i:%s') as test_start,date_format(t.test_end, '%Y-%m-%d %H:%i:%s') as test_end,t.t_test_status FROM test t WHERE t.class_code=?",con.body[0].class_code ,callback)
        
    },
    examInfo:function(con,callback){
        con.con.query("select distinct t.test_id,t.class_code,t.test_name,date_format(t.test_start, '%Y-%m-%d %H:%i:%s') as test_start,date_format(t.test_end, '%Y-%m-%d %H:%i:%s') as test_end,t.test_wait,t.test_caution,t.test_retake,t.test_shuffle,t.test_escape,t.test_lang from test t inner join test_relation_question r ON t.test_id=r.test_id where t.test_id=?",con.body.test_id,callback);
    },
    examInfo2:function(con,callback){
        con.con.query("select q.question_name,q.question_score from question q inner join test_relation_question r on q.question_id=r.question_id",callback)
    },

    examComplete:function(con,callback){
        console.log(con.classInfo[1].test_id)
        con.con.query("select s.s_email,s_name,state.test_validation,state.s_retake,state.mic_caution,state.eye_caution FROM student s LEFT OUTER JOIN state state ON s.s_email=state.s_email where state.test_id=?",con.classInfo[1].test_id,callback)
    },
    questionInfo:function(con,callback){
        con.con.query("select * from question where question_id=?",con.body.question_id,callback)
    },
    questionAlter:function(con,callback){
        var questionInfo = {
                question_id : con.body.question_id,
                question_name : con.body.question_name,
                question_score : con.body.question_score,
                question_text : con.body.question_text
        }
        con.con.query("update question set ? where question_id=?",[questionInfo,con.body.question_id])
        con.con.query("select * from question where question_id=?",con.body.question_id,callback)
    },
    questionDelete:function(con,callback){
        con.con.query("delete from test_relation_question where question_id=?",con.body.question_id)
        con.con.query("delete from question where question_id=?",con.body.question_id,callback)
    },
    eyeTracking:function(con,callback){
        con.con.query("update state SET eye_caution = eye_caution + 1 WHERE s_email=? and test_id=? ",[con.body.s_email,con.body.test_id])
        con.con.query("select s_email,eye_caution from state WHERE s_email=? and test_id=? ",[con.body.s_email,con.body.test_id],callback)
    },
}