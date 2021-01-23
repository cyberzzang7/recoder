const e = require('express');
const test = require('../model/test');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    login: async (req, res)=>{
        console.log(req.body)
    
        try { // 이메일이나 패스워드가 없을 경우
            if ( typeof req.body.s_email == "undefined"){ // 선생님이라는 뜻 
                test.tealogin(req, async(err,rows)=>{ // 비동기 함수로 Model login 함수 실행 
                if(!rows[0] || !(await bcrypt.compare(req.body.t_password,rows[0].t_password))){ // 결과 값이 없거나 비밀 번호가 일치하지 않을 경우 
                    return res.json("Email or Password is incorrect")
                }else{ // else -> id 값을 
                    const id = rows[0].t_email

                    const token = jwt.sign({id}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    })
          
                    console.log("The token is:" + token)

                    const cookieOptions ={
                        expries: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly:true
                    }
            
                    res.cookie('jwt',token,cookieOptions)
                    return res.json({"login":"success","token":token,"type":"teacher","t_name":rows[0].t_name})

                }
            })
            }
            // !req.body.t_email || ! req.body.t_password
            if (  typeof req.body.t_email == "undefined" ){// 학생이라는 뜻
                test.stdlogin(req, async(err,rows)=>{ // 비동기 함수로 Model login 함수 실행 
            
                if(!rows[0] || !(await bcrypt.compare(req.body.s_password,rows[0].s_password))){ // 결과 값이 없거나 비밀 번호가 일치하지 않을 경우 
                    return res.json("Email or Password is incorrect")
                }else{ // else -> id 값을 
                    const id = rows[0].s_email

                    const token = jwt.sign({id}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    })
          
                    console.log("The token is:" + token)

                    const cookieOptions ={
                        expries: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly:true
                    }

                    res.cookie('jwt',token,cookieOptions)
                    return res.json({"login":"success","token":token,"type":"student","s_name":rows[0].s_name})
                    
                }
            })
            }
        } catch(error) {
            console.log(error)
        }
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
        test.signup(req, async(err,rows)=>{ 
            if(err) {
                console.log(err)
            }
            if(rows.length>0) {
                res.json("That email is already in use")
            } else{
                if(req.body.type=="student"){
                    let hashedPassword = await bcrypt.hash(req.body.s_password,10)
                    req.body.hashedPassword = hashedPassword
                    console.log(hashedPassword)
                } else{
                    let hashedPassword = await bcrypt.hash(req.body.t_password,10)
                    req.body.hashedPassword = hashedPassword
                    console.log(hashedPassword)
                    
                }
                console.log(req.body)
                console.log(rows+"뭐지?")
                test.insertInfo(req, function(err,rows){
                      console.log("회원정보넣는중")
                        if(!err){
                            console.log("회원정보삽입완료")
                            res.json({"mes" : "success", "type": req.body.type })
                        }
                })
            }
        })
    },

    classcreate: function(req,res){
      
        test.classcodevalidate(req, async(err,rows)=>{
                console.log(rows)

                return res.json(rows)
        })
    
        // test.classcreate(req, async(err,rows)=>{
        // })
        
    },
    classinfo: function(req,res){
        test.classInfo(req,async(err,rows)=>{
            if(err){
                console.log(err)
            }
            console.log(rows)
            
            return res.json(rows)
        })
    },

    classjoin:function(req,res){
        test.classJoin(req, async(err,rows)=>{
            if(err){
                console.log(err)
            }
            console.log(rows)

            return res.json(rows)
        })
    },

    test: function(req, res) {
        console.log(req.body)
        res.send("서버테스트")
    }
}
