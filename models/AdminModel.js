const mysql_conn = require ('../config/db');
const util = require('util');

class Admin {

    static async getWardID(wardName){
        
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const wardID = await query('SELECT ward_id FROM `ward` WHERE ward_name=?',[wardName])[0];

        return wardID;
    }

    static async getWardInfo(wardID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `ward` WHERE `ward_id`=?',[wardID]);
        
        return result[0];
    }

    static async getWardDoctors(wardID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT user_id FROM `doctor` WHERE `ward_id`=?',[wardID]);
        
        return result;
    }

    static async getDoctorInfoByID(doctorID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT a.user_id, a.ward_id, b.username, b.first_name, b.last_name FROM `doctor` a INNER JOIN `user` b ON a.user_id = b.user_id AND a.user_id=?',[doctorID]);
    
        return result;
    }

    static async addDoctorToWard(doctorID, wardName){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'INSERT INTO `doctor` (`user_id`, `ward_id`,) VALUES (?,?);',[doctorID, wardName]);

        return result;
        
    }
    static async removeDoctorFromWard(doctorID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'UPDATE `doctor` SET `ward_id` = null WHERE `user_id` = ?',[doctorID]);

        return result;
        
    }

    static async viewNewIssues(){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `issue` WHERE `status`= 0x00');

        return result;
        
    }

    static async solveIssues(issueID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'UPDATE `issue` SET `status` = 0x01 WHERE `issue_id` = ?',[issueID]);

        return result; 
    }

    static async viewNewRegistration(){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `registration` WHERE `status`= 0');

        return result; 
    }

    static async addNewUser(username,first_name,last_name,password,type){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'INSERT INTO `user` (`username`,`first_name`,`last_name`,`password`,`type`) VALUES (?,?,?,?,?);',[username,first_name,last_name,password,type]);

        return result;
        
    }
}

module.exports = Admin;