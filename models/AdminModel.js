const mysql_conn = require ('../config/db');
const util = require('util');

class Admin {

    static async getWardID(wardName){
        
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const wardID = await query('SELECT ward_id FROM `ward` WHERE ward_name=?',[wardName])[0];

        return wardID;
    }

    static async getAllWards(){
        
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const details = await query('SELECT * FROM ward');

        return details;
    }

    static async getWardInfo(wardID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `ward` WHERE `ward_id`=?',[wardID]);
        
        return result[0];
    }

    static async getWardRosters(wardID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `roster` WHERE `ward_id`=?',[wardID]);
        
        return result;
    }

    static async getRoster(wardID,year,month){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `roster` WHERE `ward_id`=? and `year`=? and `month`=?',[wardID,year,month]);
        
        return result[0];
    }

    static async addRoster(wardID,year,month,roster){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('INSERT INTO `roster` (`ward_id`,`year`,`month`,`roster`) VALUES (?,?,?,?);',[wardID,year,month,roster]);

        return result;
    }

    static async addWorkHours(userID,month,year,hours){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('INSERT INTO `working_hours` (`user_id`,`month`,`year`,`work_hrs`) VALUES (?,?,?,?);',[userID,month,year,hours]);
        return result;
    }

    static async getWorkHours(userID,month,year){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('SELECT * FROM `working_hours` WHERE `user_id` = ? AND `month` = ? AND `year` = ?;',[userID,month,year]);
        return result[0];
    }
    
    static async getMinWorkHours(wardID,month,year){
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('SELECT a.user_id, b.work_hrs FROM `doctor` a INNER JOIN `working_hours` b WHERE a.user_id = b.user_id AND `ward_id` = ? AND `month`= ? AND `year` = ? ORDER BY b.work_hrs',[wardID,month,year]);
        return result;
    }

    static async getWardDoctorIDs(wardID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const docs = await query('select user_id from user join doctor using (user_id) where ward_id = ?',[wardID]);

        return docs;
    }

    static async getWardDoctorLeaves(wardID,month,year){
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('SELECT a.user_id, b.prefered_date FROM `doctor` a INNER JOIN `preferences`b ON a.user_id = b.doctor_id WHERE a.ward_id = ? AND b.month = ? AND b.year = ?',[wardID,month,year])
    
        return result
    }

    static async getWardDoctors(wardID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const docs = await query('select user_id, first_name, last_name from user join doctor using (user_id) where ward_id = ?',
        [wardID]);

        return docs;
    }

    static async docsWithoutWards(){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const docs = await query('select `user_id`,`first_name`,`last_name` from `user` where `type`="doctor" and `user_id` not in (select `user_id` from `doctor`)');

        return docs;

    }

    static async getDoctorInfoByID(doctorID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT a.user_id, a.ward_id, b.username, b.first_name, b.last_name FROM `doctor` a INNER JOIN `user` b ON a.user_id = b.user_id AND a.user_id=?',[doctorID]);
    
        return result;
    }

    static async addDoctorToWard(wardID,doctorID){

        if (await this.doctorExists(doctorID) && ! await this.doctorHasWard(doctorID)) {

            const query = util.promisify(mysql_conn.query).bind(mysql_conn);
            const added = await query(
                'INSERT INTO `doctor` (`user_id`,`ward_id`) VALUES (?,?)', [doctorID,wardID]
            );
            return;
        }
        return false;
    }

    static async doctorExists(doctorID){
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const doc_exists = await query('SELECT `username` FROM `user` WHERE `user_id`=?',[doctorID]);

        if(doc_exists.length==0){
            return false;
        }
        else {
            return true;
        }
    }

    static async doctorHasWard(doctorID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const doc_has_ward = await query('SELECT `ward_id` FROM `doctor` WHERE `user_id`=?',[doctorID]);

        if(doc_has_ward.length==0){
            return false;
        }
        else{
            return true;
        }
    }
    static async removeDoctorFromWard(doctorID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const temp = await query(
            'SELECT ward_id FROM `doctor` WHERE `user_id` = ?',[doctorID]);
        const result = await query(
            'DELETE FROM `doctor` WHERE `user_id` = ?',[doctorID]);
        return temp;
        
    }

    static async viewNewIssues(){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'select issue_id, first_name, last_name, message, date from issue join user on issue.doctor_id = user.user_id where status = 0;');

        return result;
        
    }

    static async solveIssues(issueID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'UPDATE `issue` SET `status` = 1 WHERE `issue_id` = ?',[issueID]);

        return; 
    }

    static async viewNewRegistration(){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `registration`');

        return result; 
    }
    static async selectNewRegistration(reqID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `registration` WHERE `req_id` = ?',[reqID]);

        return result[0]; 
    }
    static async deleteNewRegistration(reqID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'DELETE FROM registration WHERE `req_id` = ?',[reqID]);

        return; 
    }
    static async addNewUser(username,first_name,last_name,password,type){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('INSERT INTO `user` (`username`,`first_name`,`last_name`,`password`,`type`) VALUES (?,?,?,?,?);',[username,first_name,last_name,password,type]);

        return result;
        
    }


}

module.exports = Admin;