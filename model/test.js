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
        console.log(con.body.s_email)
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
                console.log(stdObj)
                console.log("학생 데이터 삽입")
                con.con.query("INSERT INTO student SET ?", stdObj ,callback)
            });
        } 
        if(con.body.type=="teacher") {
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
            (select count(test_id) from state where test_id = t.test_id and test_validation = 1) as complete_student,
            (select count(test_id) from state where test_id = t.test_id) as total_student,
            (SELECT avg(question_score) FROM test te JOIN test_relation_question tr ON te.test_id=tr.test_id JOIN question q ON q.question_id=tr.question_id 
            WHERE te.test_id=t.test_id) as average_score,
            (SELECT sum(question_score) FROM test te JOIN test_relation_question tr ON te.test_id=tr.test_id JOIN question q ON q.question_id=tr.question_id 
            WHERE te.test_id=t.test_id) as total_score,
            (select count(*) from test where t.class_code=?) as test_count,
            (select count(*) from user_relation_class u WHERE t.class_code = u.class_code AND recognize = 1) as student_count,
            t.test_id,
            t.test_name, 
            (select count(*) from test_relation_question where test_id=t.test_id) AS questioncount ,
            date_format(t.test_start, '%Y-%m-%d %H:%i') AS test_start,
            date_format(t.test_end, '%Y-%m-%d %H:%i') AS test_end,
            t.t_test_status 
            FROM test t WHERE t.class_code=?`,[con.body.class_code,con.body.class_code,con.body.class_code],callback)
        }
        if ( typeof con.body.t_email == "undefined"){
            con.con.query(
            `SELECT
            (SELECT class_name FROM class WHERE class_code=?) as class_name,
            t.test_id,
            t.test_name,
            (SELECT count(*) FROM test_relation_question WHERE test_id=t.test_id) AS questioncount ,
            date_format(t.test_start, '%Y-%m-%d') AS date,
            date_format(t.test_start, '%p %H:%i') AS test_start,
            date_format(t.test_end, '%p %H:%i') AS test_end,
            TIMESTAMPDIFF(minute, date_format(t.test_start, '%Y-%m-%d %H:%i'),  date_format(t.test_end,'%Y-%m-%d %H:%i')) AS time_diff,
            t.s_test_status
            FROM test t LEFT OUTER JOIN user_relation_class ur ON t.class_code=ur.class_code
            WHERE ur.s_email=? and ur.class_code=? and ur.recognize=1`,[con.body.class_code,con.body.s_email,con.body.class_code],callback)
        }
    },
    // testIdSearch:function(con,callback){
    //     con.con.query(`
    //     SELECT test_id FROM test t 
    //     WHERE t.class_code=? 
    //     `,con.body.class_code,callback)
    // },
    // avgscore:function(con,callback){
    //     console.log(con.body)
    //     con.con.query(`
    //     SELECT avg(qr.question_grade) as average_score FROM question_result qr 
    //     WHERE  qr.test_id=? 
    //     `,con.body.test_id,callback)
    // },
    totalScore:function(con,callback){

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
        console.log(con.body.length)
        for(var count = 0 ; con.body.length>count; count++){
             con.con.query("SELECT test_id FROM test WHERE class_code=?",con.body[count].class_code,function(err,rows){
                
                for(var count2 = 0 ; rows.length>count2; count2++){
                    con.con.query("DELETE FROM test_relation_question WHERE test_id=?",rows[count2].test_id)
                    con.con.query("DELETE FROM state WHERE test_id=?",rows[count2].test_id)
                    console.log("삭제완료")
                }
            })
                 con.con.query("DELETE FROM test WHERE class_code=?",con.body[count].class_code)
                 con.con.query("DELETE FROM user_relation_class WHERE class_code=?",con.body[count].class_code)
                 con.con.query("DELETE FROM class WHERE class_code=?",con.body[count].class_code)
        }
         con.con.query("SELECT * FROM class ",callback)
    },
    // testId: function(con,callback){
    //     for(var count = 0 ; con.body.length>count; count++){
    //          con.con.query("SELECT test_id FROM test WHERE class_code=?",con.body[count].class_code,function(err,rows){
    //             console.log(rows)
    //             for(var count2 = 0 ; rows.length>count2; count2++){
    //                 con.con.query("DELETE FROM test_relation_question WHERE test_id=?",rows[count2].test_id)
    //                 con.con.query("DELETE FROM state WHERE test_id=?",rows[count2].test_id)
    //                 console.log("삭제완료")
    //             }
    //         })
    //              con.con.query("DELETE FROM test WHERE class_code=?",con.body[count].class_code)
    //              con.con.query("DELETE FROM user_relation_class WHERE class_code=?",con.body[count].class_code)
    //              con.con.query("DELETE FROM class WHERE class_code=?",con.body[count].class_code)
    //     }
    // },
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
    classUserDelete:function(con,callback){
        for(var count=1; con.body.length>count; count++){
            con.con.query(
                `DELETE FROM user_relation_class 
                WHERE s_email=? AND class_code=?
                `,[con.body[count].s_email,con.body[0].class_code],callback)
        }
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
    retake:function(con,callback){
        
        con.con.query(
            `UPDATE 
            state
            SET s_retake = s_retake+1
            WHERE test_id=? and s_email=? and s_retake<3`, [con.body.test_id,con.body.s_email]
        )
        con.con.query(
            `SELECT
             s_retake
             FROM state
             WHERE test_id=? and s_email=?`, [con.body.test_id,con.body.s_email],callback
        )
    },
    testPaper:function(con,callback){
        // var stateInfo = {
        //             test_id : con.body[count].question_name,
        //             s_email : con.body[count].question_score,
        //             s_retake : con.body[count].question_text,
        //             mic_caution : con.body[count].question_code,
        //             eye_caution ,
        //             test_validation : 0,
        //             test_start_time: 2021-03-01,
        //             test_end_time: 2021-03-02,
        //             total_score : 100,
        //             score_validation : 0
        //         }
        //         con.con.query("INSERT INTO question SET ?",questionInfo)
        // 수정
        con.con.query(`
        SELECT
        q.question_id,
        tr.test_id,  
        q.question_name,
        q.question_score,
        q.question_text,
        q.question_code,
        t.test_lang,
        t.test_name,
        c.class_name,
        TIMESTAMPDIFF(minute, date_format(t.test_start, '%Y-%m-%d %H:%i'),  date_format(t.test_end,'%Y-%m-%d %H:%i')) AS time_diff
        FROM question q JOIN test_relation_question tr ON q.question_id=tr.question_id JOIN test t ON t.test_id=tr.test_id JOIN class c ON c.class_code=t.class_code
        WHERE t.test_id = ?`,con.body.test_id,callback)
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
        
        con.con.query(`
        UPDATE state s
        INNER JOIN student st 
        ON s.s_email = st.s_email 
        SET s.eye_caution = s.eye_caution + 1 
        WHERE st.s_number=? AND s.test_id=? `,[con.s_number,con.test_id])
        con.con.query(`
        SELECT st.s_number,s.eye_caution 
        FROM state s 
        INNER JOIN student st
        ON s.s_email = st.s_email
        WHERE st.s_number=? AND s.test_id=? `,[con.s_number,con.test_id],callback)
    },
    volumeMeter:function(con,callback){
        
        con.con.query(`
        UPDATE state s
        INNER JOIN student st 
        ON s.s_email = st.s_email 
        SET s.mic_caution = s.mic_caution + 1 
        WHERE st.s_number=? AND s.test_id=? `,[con.s_number,con.test_id])
        con.con.query(`
        SELECT st.s_number,s.mic_caution 
        FROM state s 
        INNER JOIN student st
        ON s.s_email = st.s_email
        WHERE st.s_number=? AND s.test_id=? `,[con.s_number,con.test_id],callback)
    },
    cautionPage:function(con,callback){
        con.con.query(`
        SELECT
        t.test_name,
        (SELECT s_number FROM student WHERE s_email=?) as s_number,
        date_format(t.test_start, '%Y-%m-%d %H:%i:%s') as test_start,
        date_format(t.test_end, '%Y-%m-%d %H:%i:%s') as test_end,
        (SELECT count(*) FROM test_relation_question WHERE test_id=t.test_id) AS questioncount,
        (SELECT sum(q.question_score) FROM test_relation_question rq LEFT OUTER JOIN question q ON q.question_id=rq.question_id WHERE test_id=? ) as total_score,
        TIMESTAMPDIFF(minute, date_format(t.test_start, '%Y-%m-%d %H:%i'),  date_format(t.test_end,'%Y-%m-%d %H:%i')) AS time_diff,
        t.test_caution
        FROM test t 
        WHERE t.test_id=?`,[con.body.s_email,con.body.test_id,con.body.test_id],callback)  
    },
    retakecount:function(con,callback){
        con.con.query(`
        SELECT s.s_retake,t.test_retake
        FROM test t
        INNER JOIN state s
        WHERE s.s_email = ? and s.test_id =?
        `,[con.body.s_email,con.body.test_id],callback)
    },
    stateInsert:function(con,callback){
        con.con.query(`SELECT test_id FROM state WHERE test_id=? and s_email=?`,[con.body.test_id,con.body.s_email],function(err,data){
            console.log(data.length)
        if(data.length==0){
            var stateInsert = {
                test_id : con.body.test_id,
                s_email : con.body.s_email,
                s_retake : 0,
                mic_caution : 0,
                eye_caution : 0,
                test_validation : 0,
                test_start_time : con.body.test_start_time,
                test_end_time : con.body.test_end_time,
                total_score : 0 ,
                score_validation : 0
            }
            con.con.query("INSERT INTO state SET ?",stateInsert)
            con.con.query(`
            SELECT sum(q.question_score) as question_score 
            FROM question q JOIN test_relation_question tr ON tr.question_id=q.question_id 
            WHERE test_id=?`,con.body.test_id,function(err,rows){
            console.log(rows[0])
            con.con.query("UPDATE state SET total_score=?",rows[0].question_score)
            })
            con.con.query(`
            SELECT test_start,test_end FROM test WHERE test_id=?`,con.body.test_id,function(err,rows){
            console.log(rows[0])
            con.con.query("UPDATE state SET test_start_time=?,test_end_time=?",[rows[0].test_start,rows[0].test_end],callback)
            })
            } else {
                con.con.query(`SELECT test_id FROM state WHERE test_id=? and s_email=?`,[con.body.test_id,con.body.s_email],callback)
            }
        })
        
    },
    stateView:function(con,callback){
        console.log(typeof con.body.s_email)
        if ( typeof con.body.s_email == "string") {
            con.con.query(`
            SELECT
            *,
            (SELECT sum(qr.question_grade) from question_result qr where qr.test_id=? and qr.s_email=?) as student_score,
            (SELECT sum(q.question_score) FROM test_relation_question rq LEFT OUTER JOIN question q ON q.question_id=rq.question_id where test_id=? ) as total_score
            FROM state s 
            WHERE s.test_id=? AND s.s_email=?`,[con.body.test_id,con.body.s_email,con.body.test_id,con.body.test_id,con.body.s_email],callback)
        } else {
            con.con.query(`
            SELECT
            *,
            (SELECT count(question_id) FROM test_relation_question tr WHERE tr.test_id =?) as question_count,
            (SELECT count(qr.compile_code) FROM question_result qr WHERE s.s_email=qr.s_email and qr.test_id=? ) as compile_count,
            (SELECT sum(question_grade) FROM question_result qr JOIN test_relation_question tr ON qr.question_id=tr.question_id WHERE qr.s_email=s.s_email and qr.test_id=?) as question_grade,
            (SELECT sum(q.question_score) FROM test_relation_question rq LEFT OUTER JOIN question q ON q.question_id=rq.question_id WHERE test_id=? ) as total_score
            FROM state s 
            WHERE s.test_id=?
            `,[con.body.test_id,con.body.test_id,con.body.test_id,con.body.test_id,con.body.test_id],callback)
        }
    }, 
    studentName:function(con,callback){
        con.con.query(`
        SELECT 
        s_name 
        FROM student s LEFT OUTER JOIN state st 
        ON s.s_email=st.s_email 
        WHERE st.test_id=?`,con.body.test_id,callback)
    },
    testGradingPage:function(con,callback){
        con.con.query(`
        SELECT
        qr.question_id,
        qr.s_email,
        q.question_name,
        q.question_score,
        q.question_text,
        qr.question_grade,
        qr.compile_code,
        (select sum(q.question_score) FROM test_relation_question rq LEFT OUTER JOIN question q ON q.question_id=rq.question_id where test_id=? ) as total_score
        FROM question_result qr JOIN question q ON q.question_id=qr.question_id 
        WHERE qr.test_id = ? and qr.s_email=?`,[con.body.test_id,con.body.test_id,con.body.s_email],callback)
    },
    testName:function(con,callback){
        console.log(con.body.test_id)
        con.con.query(`
        SELECT test_name FROM test WHERE test_id=? `,con.body.test_id,callback)
    },
    stdName:function(con,callback){
        console.log(con.body.s_email)
        con.con.query(`
        SELECT s_name FROM student WHERE s_email=?`,con.body.s_email,callback)  
    },
    testQuestion:function(con,callback){
        con.con.query(`
        SELECT question_id
        FROM test_relation_question
        WHERE test_id=?`,con.body.test_id,callback)
    },
    testGrading:function(con,callback){
        console.log(con.body)
        con.con.query(`
        UPDATE question_result SET question_grade=? WHERE s_email=? AND test_id=? AND question_id =?
        `,[con.body.question_grade,con.body.s_email,con.body.test_id,con.body.question_id],callback)
    },
    gradingCompleted:function(con,callback){
        console.log(con.body)
        con.con.query(`
        UPDATE state SET score_validation=? WHERE s_email=? AND test_id=?`,[con.body.score_validation,con.body.s_email,con.body.test_id],callback)
    },
    snumber:function(con,callback){
        
        con.con.query(`
        SELECT 
        s_number,
        s_name, 
        s_email,
        (SELECT eye_caution FROM state WHERE test_id=? and s_email=?) as eye_caution,
        (SELECT mic_caution FROM state WHERE test_id=? and s_email=?) as mic_caution
        FROM student WHERE s_email=?
        `,[con.test_id,con.s_email,con.test_id,con.s_email,con.s_email,],callback)
    },
    comPile:function(con,callback){
        if(con.body.command == "update"){
            console.log(con.body)
            con.con.query(`
            UPDATE question_result 
            SET compile_code =?, compile_result =? 
            WHERE s_email=? and question_id=?`,[con.body.compile_code,con.body.compile_result,con.body.s_email,con.body.question_id],callback)
        } else if (con.body.command == "insert"){
            console.log(con.body)
            var comPileInsert = {
                    s_email : con.body.s_email,
                    question_id : con.body.question_id,
                    test_id : con.body.test_id,
                    question_grade : null,
                    compile_code : con.body.compile_code,
                    compile_result : con.body.compile_result
            }
            con.con.query("INSERT INTO question_result SET ?",comPileInsert,callback)
        }
    },
    testValidation:function(con,callback){
        con.con.query(`
        UPDATE state SET test_validation='1' WHERE test_id=? and s_email=?`,[con.body.test_id,con.body.s_email],callback)
    },
    stdSearch:function(con,callback){
        con.con.query(`
        SELECT s_name from student where s_email=?`,con.s_email,callback)
    }
}
