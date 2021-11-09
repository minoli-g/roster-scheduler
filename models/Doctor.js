const db=require('../config/db');
const jwt = require('jsonwebtoken');

class Doctor{

    static async login_Initial(username, password, callback){
        await db.query(
            "SELECT * FROM user WHERE username = ?",
            username,
            (err, result) => {
                if(err){
                    callback(err, undefined);
                }else{
                    callback(undefined,result);
                }
            })
        
    }
    static async login_refresh(token, callback){
        await db.query("SELECT * FROM user WHERE user_id = ?",
        [jwt.decode(token).id],(err,result)=>{
            if(err){
                callback(err, undefined);
            }else{
                callback(undefined,result);
            }

        })

    }

    static async apply_leave(doctor_id, date, callback){
        const sqlInsert= "INSERT INTO `leave` (`doctor_id`, `date`) VALUES (?,?);";
        await  db.query(sqlInsert,[doctor_id,date],(err, result)=>{
            if(err){
                callback(err, undefined);
            }else{
                callback(undefined,result);
            }
    })
}

static async send_report(doctor_id, date, message, callback){
    const sqlInsert= "INSERT INTO `issue` (`doctor_id`, `message`, `date`) VALUES (?,?,?);";
    await db.query(sqlInsert,[doctor_id,message,date],(err, result)=>{
        if(err){
            callback(err, undefined);
        }else{
            callback(undefined,result);
        }
    })
}

static async select_preference(doctor_id, callback){
    await  db.query(
        "SELECT * FROM `preferences` WHERE doctor_id =? AND month = MONTH(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH)) AND year = YEAR(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH))",
        doctor_id,
        (err, result) => {
            if(err){
                callback(err, undefined);
            }else{
                callback(undefined,result);
            }
        })


}

static async edit_profile(uname, fname,lname,uid, callback){
    const sqlUpdate="UPDATE `user` SET `username`=?,`first_name` = ?,`last_name`=? WHERE `user_id` = ?;"
    await  db.query(sqlUpdate,[uname,fname,lname,uid],(err,result)=>{
        // console.log("modal", result);
        if(err){
            callback(err, undefined);
        }else{
            callback(undefined,result);
        }
    })
}

static async change_password(uid, callback){
    await db.query(
        "SELECT * FROM user WHERE user_id = ?",
        uid,
        (err, result) => {
            if(err){
                callback(err, undefined);
            }else{
                callback(undefined,result);
            } 
        })
}

static async view_leave(token,userid, callback){
    const sqlSelect="SELECT DATE_FORMAT(STR_TO_DATE(date,'%Y-%m-%dT%H:%i:%s.000Z'),'%Y-%m-%d') AS `date`, `status` FROM `leave` WHERE `doctor_id` = ? ORDER BY date DESC";
    await db.query(sqlSelect,[userid],(err,result)=>{
        if(err){
            callback(err, undefined);
        }else{
            callback(undefined,result);
        } 
    })

}


static async view_report(token,userid, callback){
    const sqlSelect="SELECT `message`,DATE_FORMAT(STR_TO_DATE(date,'%Y-%m-%dT%H:%i:%s.000Z'),'%Y-%m-%d') AS `date`, `status` FROM `issue` WHERE `doctor_id` = ? ORDER BY date DESC";
    await  db.query(sqlSelect,[userid],(err,result)=>{
        if(err){
            callback(err, undefined);
        }else{
            callback(undefined,result);
        } 
    })
}

static async list_doctors(callback){
    const sqlSelect="SELECT * FROM `user` WHERE type='doctor'";
    await db.query(sqlSelect,(err,result)=>{
        if(err){
            callback(err,undefined);
        }else{
            callback(undefined,result)
        }
    })
}

static async list_wards(callback){
    const sqlSelect="SELECT * FROM `ward`";
    await db.query(sqlSelect,(err,result)=>{
        if(err){
            callback(err,undefined);
        }else{
            callback(undefined,result)
        }
    })
}


static async roster(wardid,year,month, callback){
    const sqlSelect="SELECT `roster` FROM `roster` WHERE `ward_id`=? AND `year`=? AND `month`=?";
    await  db.query(sqlSelect,[wardid,year,month],(err,result)=>{
        if(err){
            callback(err, undefined);
        }else{
            callback(undefined,result);
        } 
    })
}


static async doctor(user_id,callback){
    const sqlSelect="SELECT * FROM `user` WHERE `user_id`=? AND `type`='doctor'";
    await db.query(sqlSelect,[user_id],(err,result)=>{
        if(err){
            callback(err,undefined);
        }else{
            callback(undefined,result)
        }
    })
}
static async work_hours(userid,callback){
    const sqlSelect="SELECT `month`,`work_hrs` FROM `working_hours` WHERE user_id=? ORDER BY workHour_id DESC LIMIT 12";
    
    await db.query(sqlSelect,[userid],(err,result)=>{
        if(err){
            callback(err,undefined);
        }else{
            callback(undefined,result)
        }
    })
}

static async getPre(userid,callback){
    console.log("getPre");
    const sqlSelect="SELECT DATE_FORMAT(STR_TO_DATE(prefered_date,'%Y-%m-%dT%H:%i:%s.000Z'),'%Y-%m-%d') AS `prefered_date` FROM `preferences` WHERE doctor_id = ? AND month = MONTH(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH)) AND year = YEAR(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH))";
    
    await db.query(sqlSelect,[userid],(err,result)=>{
        if(err){
            callback(err,undefined);
        }else{
            callback(undefined,result)
        }
    })
}

static async countPre(userid,callback){
    const sqlSelect="SELECT COUNT(*) FROM `preferences` WHERE doctor_id = ? AND month = MONTH(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH)) AND year = YEAR(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH))";
    
    await db.query(sqlSelect,[userid],(err,result)=>{
        if(err){
            callback(err,undefined);
        }else{
            callback(undefined,result)
        }
    })
}



}
module.exports=Doctor;