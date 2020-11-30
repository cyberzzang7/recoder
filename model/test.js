module.exports = {
    login : function(con, callback) {
        con.query("select * from student", callback)
    },

    signup : function(con, callback) {
        con.con.query("select * from student where s_email=?", con.body.s_email , callback)
        console.log(con.body)
        console.log(con.body.s_email+"있는아이디")
    },

    insertInfo : function(con, callback) {
        var stdObj = {
            s_email : con.body.s_email,
            s_name : con.body.s_name,
            s_password : con.body.s_password,
            s_phone : con.body.s_phone
        };
        
        con.con.query("INSERT INTO student SET ?", stdObj ,callback)
        console.log(con.body.s_phone)
    }
}