const db=require('../config/db');

class Doctor{

    static async login_Initial(username, password, callback){
        await db.query(
            "SELECT * FROM user WHERE username = ?",
            username,
            (err, result) => {
                if(err){
                    callback(undefined, err);
                }else{
                    callback(undefined,result);
                }
            })
        
    }
    static async login_refresh(token, callback){
        await db.query("SELECT * FROM user WHERE user_id = ?",
        [jwt.decode(token).id],(err,result)=>{
            if(err){
                callback(undefined, err);
            }else{
                callback(undefined,result);
            }

        })

    }

    static async apply_leave(doctor_id, date, callback){
        const sqlInsert= "INSERT INTO `leave` (`doctor_id`, `date`) VALUES (?,?);";
        await  db.query(sqlInsert,[doctor_id,date],(err, result)=>{
            if(err){
                callback(undefined, err);
            }else{
                callback(undefined,result);
            }
    })
}

static async send_report(doctor_id, date, message, callback){
    const sqlInsert= "INSERT INTO `issue` (`doctor_id`, `message`, `date`) VALUES (?,?,?);";
    await db.query(sqlInsert,[doctor_id,message,date],(err, result)=>{
        if(err){
            callback(undefined, err);
        }else{
            callback(undefined,result);
        }
    })
}

static async select_preference(doctor_id, datelist, callback){
    await  db.query(
        "SELECT * FROM `preferences` WHERE doctor_id = ?",
        doctor_id,
        (err, result) => {
            if(err){
                callback(undefined, err);
            }else{
                callback(undefined,result);
            }
        })


}

static async edit_profile(uname, fname,lname,uid,token, callback){
    const sqlUpdate="UPDATE `user` SET `username`=?,`first_name` = ?,`last_name`=? WHERE `user`.`user_id` = ?;"
    await  db.query(sqlUpdate,[uname,fname,lname,uid],(err,result)=>{
        if(err){
            callback(undefined, err);
        }else{
            callback(undefined,result);
        }
    })
}

static async change_password(curpass,conpass,uid, callback){
    await db.query(
        "SELECT * FROM user WHERE user_id = ?",
        uid,
        (err, result) => {
            if(err){
                callback(undefined, err);
            }else{
                callback(undefined,result);
            } 
        })
}

static async view_leave(token,userid, callback){
    const sqlSelect="SELECT DATE_FORMAT(STR_TO_DATE(date,'%Y-%m-%dT%H:%i:%s.000Z'),'%Y-%m-%d') AS `date`, `status` FROM `leave` WHERE `doctor_id` = ? ORDER BY date DESC";
    await db.query(sqlSelect,[userid],(err,result)=>{
        if(err){
            callback(undefined, err);
        }else{
            callback(undefined,result);
        } 
    })

}


static async view_report(token,userid, callback){
    const sqlSelect="SELECT `message`,DATE_FORMAT(STR_TO_DATE(date,'%Y-%m-%dT%H:%i:%s.000Z'),'%Y-%m-%d') AS `date`, `status` FROM `issue` WHERE `doctor_id` = ? ORDER BY date DESC";
    await  db.query(sqlSelect,[userid],(err,result)=>{
        if(err){
            callback(undefined, err);
        }else{
            callback(undefined,result);
        } 
    })
}




}


module.exports=Doctor;