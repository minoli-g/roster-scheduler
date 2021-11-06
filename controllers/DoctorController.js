const doctor = require('../models/Doctor');

class DoctorController {

    static reportPage(req,res){
        res.render('doctor/report');
    }

    static rosterPage(req,res){
        res.render('doctor/roster');
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

        var preference = await doctor.getPref(req.session.user.id);

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
        var preference = await doctor.getPref(doctorId);
        console.log(preference)

        if (!preference){
            doctor.submitPref(doctorId, req.body.date);
        } else {
            doctor.updatePref(doctorId, req.body.date);
        }

        res.render('doctor/preferences', {message: "Your preference was recorded", user_info:req.session.user});

    }
}

module.exports = DoctorController;