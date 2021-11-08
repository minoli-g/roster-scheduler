const mysql_conn = require ('../config/db');
const util = require('util');
const bcrypt = require('bcrypt');

class User{

    static async getUserByUsername(username){
        
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const info = await query('select * from `user` where username=?',[username]);

        return info;
    }

    static async checkRegReq(username){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const info = await query('select * from `registration` where username=?',[username]);

        return info;        
    }

    static async getDoctorWard(userID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const info = await query('SELECT ward_id FROM `doctor` WHERE user_id = ?',[userID]);

        return info[0];        
    }

    static async submitRegReq(first_name, last_name, username, type, pwd){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const info = await query(
            'INSERT INTO `registration` (`first_name`,`last_name`,`username`,`type`,`password`) VALUES (?,?,?,?,?)',
            [first_name,last_name,username,type,pwd]
        );
        console.log(info);
        return;

    }
}

module.exports=User;