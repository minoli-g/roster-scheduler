const doctor = require('../models/Doctor');

class DoctorController {

    static reportPage(req,res){
        res.render('doctor/report');
    }


    static async workhrsPage(req,res){
        const hrs = await doctor.getWorkHrs(req.session.user.id);
        if (hrs) {
            res.render('doctor/workrs', {data: hrs});
        } else {
            res.render('doctor/workrs', {message: "No data available yet"});
        }
    }

    static async prefPage(req,res){

        const month = new Date().getMonth();
        const year = new Date().getFullYear();

        var preference = await doctor.getPref(req.session.user.id, month+2, year); //for next month
        
        //console.log(preference)

        if (preference){
            preference = preference.toString().slice(0, 16);
            res.render('doctor/preferences', {message: "Your preferred date is currently "+preference +". You may change it if you wish."})
        } else {
            res.render('doctor/preferences', {message: "You haven't set any preference yet"});
        }
    }

    static leavePage(req,res){
        res.render('doctor/leave');
    }

    static sendReport(req,res){

        const doctorId = req.session.user.id;
        doctor.submitReport(doctorId, req.body.report);

        res.render('doctor/report', {message: "Your report was submitted", user_info:req.session.user});

    }

    static submitLeave(req,res){

        const doctorId = req.session.user.id;
        doctor.submitLeave(doctorId, req.body.date);

        res.render('doctor/leave', {message: "Your leave application was submitted", user_info:req.session.user});
    }

    static async submitPreferences(req,res){

        const doctorId = req.session.user.id;

        const month = new Date().getMonth();
        const year = new Date().getFullYear();

        
        var preference = await doctor.getPref(doctorId, month+2, year);

        //console.log(preference)

        if (!preference){
            doctor.submitPref(doctorId, req.body.date, month+2, year);
        } else {
            doctor.updatePref(doctorId, req.body.date, month+2, year);
        }

        res.render('doctor/preferences', {message: "Your preference was recorded", user_info:req.session.user});

    }

    static async allRostersPage(req,res){

        const wardID = req.params.wid;
        const wards = await doctor.getWardRosters(wardID);
        res.render('doctor/rosters',{details: wards, id: wardID});

    }

    static async viewRoster(req,res){

        const wardID = req.params.wid;
        const userID = req.session.user.id;
        const year = req.params.y;
        const month = req.params.m;
        const roster = await doctor.getRoster(wardID,year,month);
        const rr = JSON.parse(roster.roster)
        const doc_info = await require('../models/AdminModel').getWardDoctors(wardID);
        res.render('doctor/wardRoster',{doc_info: doc_info, details: roster, id: roster.ward_id, y:year, m:month, roster:rr, userID:userID});

    }

    static async viewMyRoster(req,res){

        const wardID = req.params.wid;
        const userID = req.session.user.id;
        const year = req.params.y;
        const month = req.params.m;
        const roster = await doctor.getRoster(wardID,year,month);
        const rr = JSON.parse(roster.roster)
        res.render('doctor/wardMyRoster',{details: roster, id: roster.ward_id, y:year, m:month, roster:rr, userID:userID});

    }



}

module.exports = DoctorController;