const mysql_conn = require ('../config/db');
const util = require('util');

class Consultant{

    static async getWardID(wardName){
        
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const wardID = await query('select ward_id from `ward` where ward_name=?');

        console.log(wardID);

        return wardID;
    }

    static async getWardInfo(wardID){

        //return all ward info in array
    }

    static async createWard(wardName, month, year){

        //SQL to insert the ward info
        //const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        //const wardID = await query('');
        //check return to see if can get ID from this itself. Else use getWardID and return it. 

        return 5;
        
    }
}

module.exports=Consultant;