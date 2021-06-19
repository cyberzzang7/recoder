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
                    return res.json({"login":"success","token":token,"type":"student","s_name":rows[0].s_name,"s_number":rows[0].s_number})
                    
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
            if(err){
                console.log(err)
            }

            console.log(rows)

            return res.json(rows)
        })
    },
    classlist: function(req,res){
        test.classList(req,async(err,rows)=>{
            if(err){
                console.log(err)
            }
            console.log(rows)
            console.log("흠 뭐지")
            return res.json(rows)
        })
    },
    classinfo:function(req,res){
        test.classInfo(req, function(err,rows){
            if(err){
                console.log(err)
            }
        
            // if(rows.length>0) {
            //     return res.json(rows)
            // } 
            // if(rows.length==0) {
            //     return res.json({"mes":"is not test"})
            // }

            switch(rows.length){
                case 0:
                    return res.json({"mes":"is not test"})
                default:
                    return res.json(rows)
            }
        })
    },
    classjoin:function(req,res){
      
        test.classJoin(req, async(err,rows)=>{
            if(err){
                console.log(err)
            }
            console.log(rows)

            return res.json({"mes":"success"})
        })
    },

    classdelete:function(req,res){
        console.log(req.body)
        test.classDelete(req,async(err,rows)=> {
            if(err){
                console.log(err)
            }
            
           
            
            return res.json({"mes":"success",rows})
      
        })
    },
    classuserdelete:function(req,res){
        test.classUserDelete(req,async(err,rows)=> {
            if(err){
                console.log(err)
            }
            console.log(rows)
            
            return res.json({"mes":"success"})
        })
    },
    usermanagement:function(req,res) {
        test.userManagement(req,async(err,rows)=>{
            if(err){
                console.log(err)
            }
            console.log({"mes":"success"})

            return res.json(rows)
        })
    },
    classrecognize:function(req,res){
        test.classRecognize(req, async(err,rows)=>{
            if(err){
                console.log(err)
            }
            console.log({"mes":"success"})

            return res.json({"mes":"success"})
        })
    },
    examcreate:function(req,res){
        test.examCreate(req, async(err,rows)=>{
            if(err){
                console.log(err)
            }
            console.log({"mes":"success"})

            return res.json({"mes":"success"})
        })
    },
    examinfo:function(req,res){
        test.examInfo(req,async(err,rows)=>{
            if(err){
                console.log(err)
            }
                test.examInfo2(req,async(err,rowss)=>{
                    if(err){
                        console.log(err)
                    }   
                    if(rows.length>0){
                        for(var count = 0, number = 1; rowss.length>count; count++,number++){
                    
                            rows[number] = rowss[count]
                    
                        // 내일 진행 + 구슬이 요청 사항 2개 추가 문제 개수 시험지 개수 학생 명단 이런거 ? 
                        }
                        return res.json(rows)
                    }
                    return res.json("생성된 시험지가 없습니다.")   
                })
        })
    },
    examdelete:function(req,res){
        test.examDelete(req, async(err,rows)=>{
            if(err){
                console.log(err)
               
            }
            console.log(rows)

            return res.json({"mes":"success"})
        })
    },
    testpaper:function(req,res){
        test.testPaper(req, async(err,rows)=>{
            if(err){
                console.log(err)
               
            }
            console.log(rows)

            return res.json(rows)
        })
    },
    testgradingpage:function(req,res){
      test.testGradingPage(req,async(err,rows)=>{
          if(err){
                console.log(err)
               
            }
            console.log(rows)
            
            return res.json(rows)
      })  
    },
    testgrading:function(req,res) {
        test.testGrading(req,async(err,rows)=>{
            if(err) {
                console.log(err)
            }
   

            return res.json({"mes":"success"})
        })
    },
    gradingcompleted:function(req,res){
        test.gradingCompleted(req,async(err,rows)=>{
            if(err) {
                console.log(err)
            }

            return res.json({"mes":"success"})
        })
    },
    cautionpage: function (req,res){
        test.cautionPage(req,async(err,rows)=>{
            if(err){
                console.log(err)
               
            }
            console.log(rows)

            return res.json(rows)
        })
    },
    examcomplete:function(req,res){
        test.classInfo(req,async(err,rows)=>{
            req.classInfo = rows
            console.log(req)
            test.examComplete(req,async(err,rowss)=>{
                let complete = rowss
                return res.json(complete)
            })
        })
    },
    retake:function(req,res){
        test.retake(req,async(err,rows)=>{
            if(err){
                console.log(err)
            }
            console.log(rows)

            return res.json(rows)
        })
    },
    questioninfo:function(req,res){
        test.questionInfo(req,async(err,rows)=>{
             if(err){
                console.log(err)
               
            }
            console.log(rows)

            return res.json(rows)
        })
    },
    questionalter:function(req,res){
        test.questionAlter(req,async(err,rows)=>{
               if(err){
                console.log(err)
               
            }
            console.log(rows)

            return res.json(rows)
        })
    },
    questiondelete:function(req,res){
        test.questionDelete(req,async(err,rows)=>{
            if(err){
                console.log(err)
               
            }
   

            return res.json({"mes":"success"})
        })
    },
    eyetracking:function(req,res){
        test.eyeTracking(req,async(err,rows)=>{
            if(err){
                console.log(err)
               
            }
            console.log(rows)

            return res.json(rows)
        })
    },
    stateinsert:function(req,res){
        test.stateInsert(req,async(err,rows)=>{
            if(err){
                console.log(err)
            }
            

            return res.json({"mes":"success"})
        })
    },
    stateview:function(req,res){
        test.stateView(req,async(err,rows)=>{
            if(err){
                console.log(err)
            }
            if(typeof req.body.s_email=="undefined"){
                test.studentName(req,async(err,rowss)=>{
                    console.log(rowss)
                        if(rows.length>0){
                            for(var count = 0, number = 0; rowss.length>count; count++,number++){
                    
                                rows[number].s_name = rowss[count].s_name
                    
                        // 내일 진행 + 구슬이 요청 사항 2개 추가 문제 개수 시험지 개수 학생 명단 이런거 ? 
                            }
                        }
                    return res.json(rows)
                })
            } else if(typeof req.body.t_email=="undefined"){
                return res.json(rows)
        }
            
        })
    },
    compile:function(req,res){
        test.comPile(req,async(err,rows)=>{
            if(err){
                console.log(err)
            }

            console.log(rows)

            return res.json({"mes":"success"})
        })
    },
    testvalidation:function(req,res){
        test.testValidation(req,async(err,rows)=>{
              if(err){
                console.log(err)
            }

            console.log(rows)

            return res.json({"mes":"success"})
        })
    },
    // roomcreate:function(req,res){
    //     //ㅡㅡㅡㅡㅡㅡ웹 소켓 ㅡㅡㅡㅡㅡㅡ//
    // const server = require('http').createServer(app).listen(3001, ()=> {
    //     console.log("포트 3001에 연결되었습니다.")
    // });
        
    // const options = { 
    //     cors:true,
    //     origins:["http://127.0.0.1:3001","*"], };
    //     const io = require('socket.io')(server,options);
    //     io.on('connection', socket=>{
    //         console.log("connect client by Socket.io", socket.request.connection._peername);
    //         socket.to(req.body.test_id).emit('some event')   
    //         socket.join(req.body.test_id)
    //         console.log(socket.adapter.rooms)
    // })
    

    // return res.send({"mes":"success","room":"방이 개설 되었습니다."})

    // },
    test: function(req, res) {
        console.log(req.body)
        res.send("서버테스트")
    }
}
