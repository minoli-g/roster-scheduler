const mysql_conn = require ('../config/db');
const util = require('util');
const bcrypt = require('bcrypt');

class User{

    static async getUserByUsername(username){
        
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const info = await query('select * from `user` where username=?',[username]);

        return info;
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