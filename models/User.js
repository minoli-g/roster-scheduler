const mysql_conn = require ('../config/db');
const util = require('util');

class User{

    static async getUserByUsername(username){
        
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const info = await query('select * from `user` where username=?',[username]);

        return info;
    }
}

module.exports=User;