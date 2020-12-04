const bcrypt = require('bcrypt')
const SALT_ROUNDS = 12;
module.exports = {
    login : function(con, callback) {
        con.con.query("select * from student where s_email=? ",con.body.s_email, callback)
       
    },

    signup : function(con, callback) {
        con.con.query("select * from student where s_email=?", con.body.s_email , callback)
    },

    insertInfo : function(con, callback) {
            var stdObj = {
                s_email : con.body.s_email,
                s_name : con.body.s_name,
                s_password : con.body.hashedPassword,
                s_phone : con.body.s_phone,
            };
        con.con.query("INSERT INTO student SET ?", stdObj ,callback)
    }
}