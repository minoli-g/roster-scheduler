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
}

module.exports = Doctor;