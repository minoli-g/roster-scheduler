const mysql_conn = require ('../config/db');
const util = require('util');
const { query } = require('express-validator');

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

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query(
            'SELECT * FROM `ward` WHERE `ward_id`=?',[wardID]);
        
        if(result.length==0){
            return false;
        }
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

    static async docsWithoutWards(){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const docs = await query('select `user_id`,`first_name`,`last_name` from `user` where `type`="doctor" and `user_id` not in (select `user_id` from `doctor`)');

        //console.log(docs[0].first_name)
        return docs;

    }

    static async addDoctor(wardID,doctorID){

        if (await this.doctorExists(doctorID) && ! await this.doctorHasWard(doctorID)) {

            const query = util.promisify(mysql_conn.query).bind(mysql_conn);
            const added = await query(
                'INSERT INTO `doctor` (`user_id`,`ward_id`) VALUES (?,?)', [doctorID,wardID]
            );
            return;
        }
        return false;
    }

    static async editWard(wardID,min_docs,morning_start,day_start,night_start){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const edited = await query(
            'UPDATE `ward` SET `min_docs`=?,`morning_start`=?,`day_start`=?,`night_start`=? WHERE `ward_id`=?',
            [min_docs,morning_start,day_start,night_start,wardID]
        );
        //console.log(edited);

    }

    static async getLeaveApps(consultantID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const leaves = await query('show tables',
        [consultantID]);
        console.log(leaves);
        return leaves;

    }

    static async updateLeave(appID,status){
        //update leave table 
        //change roster
        
    }

    static async getReports(consultantID){
        //return doctor name, ward name and message

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const issues = await query(
            //'select * from issue where doctor_id in (select user_id from doctor where ward_id in (select ward_id from ward join user on ward.consultant_id=user.user_id  where ward.consultant_id=?))',
            'select issue_id, first_name, last_name, message, date from issue join user on issue.doctor_id = user.user_id where status = 0 and doctor_id in (select user_id from doctor where ward_id in (select ward_id from ward join user on ward.consultant_id=user.user_id  where ward.consultant_id=?));',
            [consultantID]
        );
        console.log(issues);
        return issues;

    }

    static async markReport(issueID){
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const resolve = await query('update issue set status=1 where issue_id=?',[issueID]);
        return;
    }
}

module.exports=Consultant;