const bcrypt = require('bcrypt');
const saltRounds=10;
const db =require('../config/db');
const jwt = require('jsonwebtoken');
const Doctor= require("../models/Doctor");



const login_Initial = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    Doctor.login_Initial(username, password,(err, result)=>{
        if (err) {
            res.status(403).send({err: err})
        } 
        else if (result.length > 0) {
            bcrypt.compare(password, result[0].password,(error,response)=>{
                if (response){
                    if(result[0].type  === "doctor"){
                        // cd server
                        delete result[0].password
                        const id=result[0].user_id;
                        const token=jwt.sign({id},"jwttoken",{
                            expiresIn: 3000,
                        })
                        
                        req.session.user=result;
                        // console.log(result);
                        req.auth = true;
                        req.token = token;
                        req.result = result;
                        //req.cookie = req.session.user;
                        next();
                        // res.json({auth: true, token: token, result: result, cookie: req.session.user});
                    }else{
                        return res.json({auth: false, message: "Sorry you can't login.."})
                    }
                }else{
                    return res.json({auth: false, message: "Wrong password"})
                }
            })
        } else {
           return res.json({ auth: false, message: "User doesn't exist" })
        }
    })
}


const login_refresh = async(req,res,next)=>{
    const token=req.headers["x-access-token"];
    Doctor.login_refresh(token, (err,result)=>{
        if(err){
            return res.status(403).send({err: err});
         }else{
             delete result[0].password
             req.session.user=result;
             req.result = result;
             next();
         }
    })
}
const logout=async(req,res,next)=>{
    req.session.destroy(err=>{
        if (!err){
            res.clearCookie("session_cookie_name");
            // res.json("Cookie Cleared")
            req.result="Successfully logout... ";
            next();
        }else{
            return res.status(400).send({err: err})
        }
    })

}

const apply_leave=async(req,res,next)=>{
    const doctor_id=req.body.userid;
    const date= req.body.date;
    Doctor.apply_leave(doctor_id, date, (err,result)=>{
        // console.log(err);
        if (result){
            // res.json({result})
            // console.log("hi");
            // console.log(result);
            req.result= result;
            next();
        }else{
            return res.status(500).json({err: "Internel server error"})
        }
    })
}

const send_report=async(req,res,next)=>{
    const doctor_id=req.body.userid;
    const date= req.body.date;
    const message= req.body.msg;
    Doctor.send_report(doctor_id, date, message, (err,result)=>{
        if (result){
            // res.json({result})
            req.result=result;
            next();
        }else{
            return res.status(500).json({err: "Internel server error"})
        }
    })
}

const select_preference=async(req,res,next)=>{
    const doctor_id=req.body.userid;
    const date= req.body.date;
    Doctor.select_preference(doctor_id, (err,result)=>{
        console.log(result);
        if (err) {
            return res.status(403).json({err: err})
        } 
        if (result.length > 0) {
           const sqlUpdate= "UPDATE `preferences` SET prefered_date=? WHERE `preferences`.`doctor_id` = ? AND preferences.month = MONTH(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH)) AND preferences.year = YEAR(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH))"
           db.query(sqlUpdate,[date,doctor_id]);
        //    res.json({message: "Updated successfully"})
           req.result="Updated successfully"
           next();
        } else {
            const sqlInsert= "INSERT INTO `preferences` (`doctor_id`,year,month,prefered_date) VALUES (?,YEAR(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH)),MONTH(ADDDATE(CURRENT_DATE, INTERVAL 1 MONTH)),?)"
            db.query(sqlInsert,[doctor_id,date])
            // res.json({message: "Inserted successfully"});
            req.result="Inserted successfully";
            next();
        }
    })
}


const edit_profile=async(req,res,next)=>{
    const uname= req.body.username
    const fname= req.body.fname
    const lname= req.body.lname
    const uid=req.body.userid
    // const token=req.headers["x-access-token"];
    Doctor.edit_profile(uname,fname, lname, uid, (err,result)=>{
        if(result){
            // console.log(result);
            // const cid=jwt.decode(token).id;
            db.query("SELECT * FROM user WHERE user_id = ?",uid,(error,ru)=>{
                if(error){
                    return res.status(403).json({err: error})
                }else{
                    delete ru[0].password;
                    req.session.user=ru;
                    // res.json({auth: true, result: ru})
                    req.auth=true;
                    req.result=ru;
                    next();
                }
            })
        }else{
            return res.status(400).json({err: err})
        }
    })
}

const change_password=async(req,res,next)=>{
    const curpass=req.body.curpass;
    const conpass=req.body.conpass;
    const uid= req.body.userid;
    Doctor.change_password( uid, (err,result)=>{
         
        if (err) {
            return res.status(403).json({err: err})
        } 
        else if (result.length > 0) {
            bcrypt.compare(curpass, result[0].password,(error,response)=>{
                if (error){
                    res.status(403).json({err: error})
                }else{
                    if(response){
                        const hash = bcrypt.hashSync(conpass, saltRounds);
                        db.query("UPDATE `user` SET `password`=? WHERE `user`.`user_id` = ?",[hash,uid],(er,ru)=>{
                            if(ru){
                                // res.json({message: "Password updated successfully"});
                                req.result="Password updated successfully";
                                next();
                            }else{
                                return res.status(403).json({err: er})
                            }
                            
                        })
                    }else{
                        return res.json({err: "Wrong current password"})
                    }
                    
                }
            })
        }else{
            return res.status(404).json({err: "Not found"})
        } 
    })
}


const view_leave = async(req,res,next)=>{
    const token=req.headers["x-access-token"];
    const userid=jwt.decode(token).id;
    Doctor.view_leave(token, userid, (err,result)=>{
        if (err){
            return res.status(403).json({err: err})
        }else if(result){
            if(result.length >0){
                
                req.result=result;
                next();
            }else{
                return res.status(404).json({err: "Not found"})
            }
        }
    })
}

const view_report = async(req,res,next)=>{
    const token=req.headers["x-access-token"];
    const userid=jwt.decode(token).id;
    Doctor.view_report(token, userid, (err,result)=>{
        if (err){
            return res.status(403).json({err: err})
        }else if(result){
            if(result.length >0){
                // res.json({result})
                req.result=result;
                next();
            }else{
                return res.status(404).json({err: "Not found"})
            }
        }
    })
}

const list_doctors = async(req, res, next)=>{
    Doctor.list_doctors((err,result)=>{
        if(err){
            return res.status(403).json({err : err});
        }else if(result){
            if(result.length>0){
                delete result[0].password;
                req.result=result;
                next();
            }else{
                return res.status(404).json({err : "Not Found"});
            }

        }
    })
}
const list_wards = async(req, res, next)=>{
    Doctor.list_wards((err,result)=>{
        if(err){
            return res.status(403).json({err : err});
        }else if(result){
            if(result.length>0){
                req.result=result;
                next();
            }else{
                return res.status(404).json({err : "Not Found"});
            }

        }
    })
}

const roster = async(req,res,next)=>{
    const wardid=req.query.wardid;
    const year=req.query.year;
    const month=req.query.month;
    Doctor.roster( wardid,year,month, (err,result)=>{
        if (err){
            return res.status(403).json({err: err})
        }else if(result){
            if(result.length >0){
                // res.json({result})
                req.result=result;
                next();
            }else{
                return res.status(404).json({err: "Not found"})
            }
        }
    })
}

const doctor = async(req, res, next)=>{
    const user_id=req.query.id;
    Doctor.doctor(user_id,(err,result)=>{
        if(err){
            return res.status(403).json({err : err});
        }else if(result){
            if(result.length>0){
                delete result[0].password;
                req.result=result;
                next();
            }else{
                return res.status(404).json({err : "Not Found"});
            }

        }
    })
}
const work_hours = async(req, res, next)=>{
    const userid= req.query.userid;
    Doctor.work_hours(userid,(err,result)=>{
        if(err){
            return res.status(403).json({err : err});
        }else if(result){
            if(result.length>0){
                req.result=result;
                next();
            }else{
                return res.status(404).json({err : "Not found"});
            }

        }
    })
}

const getPre = async(req, res, next)=>{
    const userid= req.query.userid;
    Doctor.getPre(userid,(err,result)=>{
        if(err){
            return res.status(403).json({err : err});
        }else if(result){
            if(result.length>0){
                req.result=result;
                next();
            }else{
                return res.status(404).json({err : "Not found"});
            }

        }
    })
}

const countPre = async(req, res, next)=>{
    const userid= req.query.userid;
    Doctor.countPre(userid,(err,result)=>{
        if(err){
            return res.status(403).json({err : err});
        }else if(result){
            if(result.length>0){
                req.result=result;
                next();
            }else{
                return res.status(404).json({err : "Not found"});
            }

        }
    })
}



module.exports = {login_Initial, login_refresh, logout, apply_leave, send_report, 
    select_preference, edit_profile, change_password, view_leave, view_report, list_doctors, list_wards,roster,doctor,work_hours, getPre,countPre};
