const mysql_conn = require ('../config/db');
const util = require('util');

class Doctor {

    static async submitReport(doctorId, message){

        const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('insert into issue(doctor_id, message, date, status) values(?,?,?,?)',
        [doctorId, message,today,0]);

        console.log(today);
        return;
    }

    static async submitLeave(doctorId, date){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('insert into `leave`(`doctor_id`, `date`, `status`) values(?,?,?)',
        [doctorId, date,'pending']);
    }

    static async submitPref(doctorId, date, month, year){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('insert into `preferences`(`doctor_id`, `month`, `year`, `prefered_date`) values(?,?,?,?)',
        [doctorId, month, year, date]);
    }

    static async getPref(doctorId, month, year){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('select prefered_date from preferences where doctor_id=? and month=? and year=?',[doctorId, month, year]);


        if(result.length==0){ return false; }

        return result[0].prefered_date;
    }

    static async updatePref(doctorId, date, month, year){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('update `preferences` set `prefered_date` = ? where doctor_id = ? and month = ? and year = ?',
        [date, doctorId, month, year]);
    }

    static async getWorkHrs(doctorId){
        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const result = await query('select month, year, work_hrs from working_hours where user_id = ?', [doctorId]);

        if(result.length==0){ return false; }

        return result;
    }

    static async hasWard(doctorID){

        const query = util.promisify(mysql_conn.query).bind(mysql_conn);
        const doc_has_ward = await query('SELECT `ward_id` FROM `doctor` WHERE `user_id`=?',[doctorID]);

        if(doc_has_ward.length==0){
            return false;
        }
        else{
            return true;
        }
    }
}

module.exports = Doctor;