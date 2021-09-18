const mysql_conn = require ('../config/db');
const util = require('util');

class Consultant{

    static async getWardID(wardName){
        
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        var wardID = await query('select `ward_id` from `ward` where ward_name=?',[wardName]);

        if (wardID.length==0){ 
            return false;
        }
        
        wardID = wardID[0].ward_id; 

        return wardID;
    }

    static async getWardInfo(wardID){

        //return all ward info in array
        //TODO - handle no such ward error

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `ward` WHERE `ward_id`=?',[wardID]);
        

        return result[0];
    }

    static async createWard(wardName, consultantID, month, year){

        //SQL to insert the ward info
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'INSERT INTO `ward` (`ward_id`, `ward_name`, `consultant_id`, `start_month`, `start_year`) VALUES (?,?,?,?,?);',
            [null,wardName,consultantID,month,year]
            );

        //get ward ID from SQL results
        console.log(result.insertId);

        return result.insertId;
        
    }

    static async addDoctor(wardID,doctorID){

        //Check if doctor has a ward
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const doc_exists = await query('SELECT `username` FROM `user` WHERE `user_id`=?',[doctorID]);
        const doc_has_ward = await query('SELECT `ward_id` FROM `doctor` WHERE `user_id`=?',[doctorID]);


        //SQL add the doctor- modify doctor's table
        if ((doc_exists.length!=0) && (doc_has_ward.length==0)){
            
            const added = await query(
                'INSERT INTO `doctor` (`user_id`,`ward_id`) VALUES (?,?)', [doctorID,wardID]
            );
            console.log(added);
            return true;
        }

        else {
            return false;
        }

    }

    static async editWard(wardID,min_docs,morning_start,day_start,night_start){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const edited = await query(
            'UPDATE `ward` SET `min_docs`=?,`morning_start`=?,`day_start`=?,`night_start`=? WHERE `ward_id`=?',
            [min_docs,morning_start,day_start,night_start,wardID]
        );
        //console.log(edited);

    }

    static async updateLeave(appID,status){
        
    }
}

module.exports=Consultant;