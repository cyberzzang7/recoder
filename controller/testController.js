const e = require('express');
const test = require('../model/test');

module.exports = {
    login: function(req, res) {
        test.login(req.con, function(err, rows){
            console.log(req.body.s_email)
            console.log(req.body.s_password)
            
            if(!err){
                if(rows[0].s_email==req.body.s_email){ 
                if (req.session.user) {
                    console.log('이미 로그인 되어 있음');
                } else {
                    req.session.user = {
                    id: req.body.s_email,
                    password: req.body.s_password,
                    authorized: true
                    };
                    console.log('세션 저장 완료');
                }
                    res.json({"info" : rows[0].s_name, "check" : true})
                }else{
                    res.json({"check":false});
                }
            } else
                res.json({"check":false});
        })
    },

    logout: function(req, res) {
        console.log('logout 함수 호출됨')

        if(req.session.user) {
            console.log('로그아웃 처리');
            req.session.destroy(
                function(err) {
                    if (err) {
                    console.log('세션 삭제시 에러');
                    return;
                    }
                console.log('세션 삭제 성공');
                }
            )
        } else {
            console.log('로그인 안되어 있음');
        }
        res.send("테스트")
    },

    signup: function(req, res) {
        test.signup(req, function(err, rows){
            console.log(req.body.s_email+"흠")
            console.log(req.body)
            console.log("흠")
            if(!err){
                if( rows!=""){
                    console.log("이미 있는 아이디")
                    res.json({"mes" : "failed", "check": false })
                    console.log(rows)
                    console.log(req.body.s_email)
                }else{
                    test.insertInfo(req, function(err,rows) {
                    console.log("회원정보넣는중")
                        if(!err){
                            console.log("회원정보삽입완료")
                            res.json({"mes" : "success", "check": true })
                        }
                    })  
                    console.log('될까')
                }
             }
        })
    }
}
