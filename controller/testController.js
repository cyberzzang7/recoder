const e = require('express');
const test = require('../model/test');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    login: async (req, res)=>{
        console.log(req.body)
        try { // 이메일이나 패스워드가 없을 경우
            if ( !req.body.s_email || !req.body.s_password){
                return res.json("Please provide an email and password")
                
            }
            test.login(req, async(err,rows)=>{ // 비동기 함수로 Model login 함수 실행 
                if(!rows || !(await bcrypt.compare(req.body.s_password,rows[0].s_password))){ // 결과 값이 없거나 비밀 번호가 일치하지 않을 경우 
                    return res.json("Email or Password is incorrect")
                }else{
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
                    res.json({"login":"success","token":token})
                }
            })
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
                let hashedPassword = await bcrypt.hash(req.body.s_password ,8)
                req.body.hashedPassword = hashedPassword
                console.log(hashedPassword)
                console.log(req.body)
                test.insertInfo(req, function(err,rows){
                      console.log("회원정보넣는중")
                        if(!err){
                            console.log("회원정보삽입완료")
                            res.json({"mes" : "success", "check": true })
                        }
                })
            }
        })
    },
    test: function(req, res) {
        console.log(req.query)
        res.send("서버테스트")
    }
}
