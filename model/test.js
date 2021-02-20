const bcrypt = require('bcrypt')
const SALT_ROUNDS = 12;
module.exports = {
    stdlogin : function(con, callback) {
        con.con.query("SELECT * FROM student WHERE s_email=? ",con.body.s_email, callback)
        console.log("학생 로그인")
    },
    tealogin : function(con, callback) {
        con.con.query("SELECT * FROM teacher WHERE t_email=?", con.body.t_email,callback)
        console.log("선생 로그인")
    },

    signup : function(con, callback) {
        console.log(con.body.type)
        if(con.body.type=="student")
            con.con.query("SELECT * FROM student WHERE s_email=?", con.body.s_email , callback)
            console.log("학생 회원가입 중복 여부 검사")
        if(con.body.type=="teacher")
            con.con.query("SELECT * FROM teacher WHERE t_email=?", con.body.t_email , callback)
            console.log("선생 회원가입 중복 여부 검사")
    },

    insertInfo : function(con, callback) {
        if(con.body.type=="student"){
            con.con.query("SELECT MAX(s_number) AS s_number FROM student",function(err,rows){
                console.log(rows)
                var stdObj = {
                    s_email : con.body.s_email,
                    s_name : con.body.s_name,
                    s_password : con.body.hashedPassword,
                    s_phone : con.body.s_phone,
                    s_number : rows[0].s_number+3
                };
                console.log("학생 데이터 삽입")
                con.con.query("INSERT INTO student SET ?", stdObj ,callback)
            });
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
        con.con.query("SELECT class_code FROM class WHERE t_email=?",con.body.t_email,callback)
    
      
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
        con.con.query("SELECT * FROM class WHERE t_email=?",con.body.t_email,callback)
    
    },
    classInfo: function(con,callback){
        if ( typeof con.body.s_email == "undefined"){ 
            con.con.query(
            `SELECT 
            (select count(*) from test where t.class_code=?) as test_count,
            (select count(*) from user_relation_class u WHERE t.class_code = u.class_code AND recognize = 1) as student_count,
            t.test_id,
            t.test_name, 
            (select count(*) from test_relation_question where test_id=t.test_id) AS questioncount ,
            date_format(t.test_start, '%Y-%m-%d %H:%i:%s') AS test_start,
            date_format(t.test_end, '%Y-%m-%d %H:%i:%s') AS test_end,
            t.t_test_status 
            FROM test t WHERE t.class_code=?`,[con.body.class_code,con.body.class_code,con.body.class_code],callback)
        }
        if ( typeof con.body.t_email == "undefined"){
            con.con.query(
            `SELECT
            (select class_name from class where class_code=?) as class_name,
            t.test_id,
            t.test_name,
            (select count(*) from test_relation_question where test_id=t.test_id) AS questioncount ,
            date_format(t.test_start, '%Y-%m-%d') AS date,
            date_format(t.test_start, '%p %H:%i') AS test_start,
            date_format(t.test_end, '%p %H:%i') AS test_end,
            TIMESTAMPDIFF(minute, date_format(t.test_start, '%Y-%m-%d %H:%i'),  date_format(t.test_end,'%Y-%m-%d %H:%i')) AS time_diff,
            t.s_test_status
            FROM test t
            WHERE t.class_code=?`,[con.body.class_code,con.body.class_code],callback)
        }
    },
    examDelete: function(con,callback){
        con.con.query("DELETE FROM test_relation_question WHERE test_id=?",con.body.test_id)
        con.con.query("DELETE FROM test WHERE test_id=?",con.body.test_id,callback)
    },
    classList: function(con,callback){
        if ( typeof con.body.s_email == "undefined"){ 
            con.con.query("SELECT * FROM class WHERE t_email=?",con.body.t_email,callback)
        }
        if ( typeof con.body.t_email == "undefined" ){
            con.con.query(`
            SELECT 
            c.class_num,
            c.class_name,
            c.class_code,
            u.recognize 
            FROM class c LEFT OUTER JOIN user_relation_class u 
            ON c.class_code=u.class_code 
            WHERE u.s_email=?`,con.body.s_email,callback)
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
            con.con.query("DELETE FROM test WHERE class_code",con.body[count].class_code)
            con.con.query("DELETE FROM user_relation_class WHERE class_code=?",con.body[0].class_code)
            con.con.query("DELETE FROM class WHERE class_code=?",con.body[0].class_code)
        } else {
            for(count =0; con.body.length>count; count++){
                con.con.query("DELETE FROM test WHERE class_code=?",con.body[count].class_code)
                con.con.query("DELETE FROM user_relation_class WHERE class_code=?",con.body[count].class_code)
                con.con.query("DELETE FROM class WHERE class_code=?",con.body[count].class_code)
            }
        }
         con.con.query("SELECT * FROM class WHERE t_email=?",con.body[0].t_email,callback)
    },
    userManagement:function(con,callback){
        con.con.query(
            `SELECT 
            s.s_email,
            s.s_name,
            u.recognize 
            FROM student s LEFT OUTER JOIN user_relation_class u 
            ON s.s_email=u.s_email 
            WHERE class_code=?`,con.body.class_code,callback)
    },
    classRecognize:function(con,callback){
        console.log(con.body.length)
        console.log(con.body[0].s_email)
        console.log(con.body[0].class_code)
        for(let count=0; con.body.length>count; count++){
            con.con.query(
                `UPDATE user_relation_class SET recognize = true 
                WHERE s_email=? AND class_code=?`,[con.body[count].s_email,con.body[count].class_code]);
        }
        con.con.query("SELECT * FROM user_relation_class",callback)
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
            con.con.query("SELECT MAX(test_id) AS test_id FROM test",function(err,rows){
                 var questionInfo = {
                    question_name : con.body[count].question_name,
                    question_score : con.body[count].question_score,
                    question_text : con.body[count].question_text,
                    question_code : con.body[count].question_code
                }
                con.con.query("INSERT INTO question SET ?",questionInfo)
                con.con.query("SELECT MAX(question_id) AS question_id FROM question",function(err,rowss){
                    var test_relation_question= {
                        test_id : rows[0].test_id,
                        question_id : rowss[0].question_id
                    }
                    console.log(rowss[0].question_id)
                    con.con.query("INSERT INTO test_relation_question SET ?",test_relation_question)
                })
            })
        }
    con.con.query(
        `SELECT 
        t.test_id,
        t.test_name, 
        (SELECT count(*) FROM test_relation_question WHERE test_id=t.test_id) AS questioncount ,
        date_format(t.test_start, '%Y-%m-%d %H:%i:%s') AS test_start,
        date_format(t.test_end, '%Y-%m-%d %H:%i:%s') AS test_end,
        t.t_test_status 
        FROM test t 
        WHERE t.class_code=?`,con.body[0].class_code ,callback)
        
    },
    examInfo:function(con,callback){
        con.con.query(
            `SELECT distinct 
            t.test_id,
            t.class_code,
            t.test_name,
            date_format(t.test_start, '%Y-%m-%d %H:%i:%s') as test_start,
            date_format(t.test_end, '%Y-%m-%d %H:%i:%s') as test_end,
            t.test_wait,
            t.test_caution,
            t.test_retake,
            t.test_shuffle,
            t.test_escape,
            t.test_lang 
            FROM test t INNER JOIN test_relation_question r 
            ON t.test_id=r.test_id 
            WHERE t.test_id=?`,con.body.test_id,callback);
    },
    examInfo2:function(con,callback){
        con.con.query(
            `SELECT 
            q.question_name,
            q.question_score 
            FROM question q INNER JOIN test_relation_question r 
            ON q.question_id = r.question_id`,callback)
    },

    examComplete:function(con,callback){
        console.log(con.classInfo[1].test_id)
        con.con.query(
            `SELECT 
            s.s_email,
            s_name,
            state.test_validation,
            state.s_retake,
            state.mic_caution,
            state.eye_caution 
            FROM student s LEFT OUTER JOIN state state 
            ON s.s_email=state.s_email 
            WHERE state.test_id=?`,con.classInfo[1].test_id,callback)
    },
    questionInfo:function(con,callback){
        con.con.query("SELECT * FROM question WHERE question_id=?",con.body.question_id,callback)
    },
    questionAlter:function(con,callback){
        var questionInfo = {
                question_id : con.body.question_id,
                question_name : con.body.question_name,
                question_score : con.body.question_score,
                question_text : con.body.question_text,
                question_code : con.body.question_code
        }
        con.con.query("UPDATE question SET ? WHERE question_id=?",[questionInfo,con.body.question_id])
        con.con.query("SELECT * FROM question WHERE question_id=?",con.body.question_id,callback)
    },
    questionDelete:function(con,callback){
        con.con.query("DELETE FROM test_relation_question WHERE question_id=?",con.body.question_id)
        con.con.query("DELETE FROM question WHERE question_id=?",con.body.question_id,callback)
    },
    eyeTracking:function(con,callback){
        console.log(con.body)
        con.con.query("UPDATE state SET eye_caution = eye_caution + 1 WHERE s_email=? AND test_id=? ",[con.body.s_email,con.body.test_id])
        con.con.query("SELECT s_email,eye_caution FROM state WHERE s_email=? AND test_id=? ",[con.body.s_email,con.body.test_id],callback)
    },
    cautionPage:function(con,callback){
        con.con.query(`
        SELECT
        t.test_name,
        date_format(t.test_start, '%Y-%m-%d %H:%i:%s') as test_start,
        date_format(t.test_end, '%Y-%m-%d %H:%i:%s') as test_end,
        (select count(*) from test_relation_question where test_id=t.test_id) AS questioncount,
        (select sum(q.question_score) FROM test_relation_question rq LEFT OUTER JOIN question q ON q.question_id=rq.question_id where test_id=? ) as total_score,
        TIMESTAMPDIFF(minute, date_format(t.test_start, '%Y-%m-%d %H:%i'),  date_format(t.test_end,'%Y-%m-%d %H:%i')) AS time_diff,
        t.test_caution  
        FROM test t 
        WHERE t.test_id=?`,[con.body.test_id,con.body.test_id],callback)
        
    }
}