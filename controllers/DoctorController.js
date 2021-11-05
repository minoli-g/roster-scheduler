const doctor = require('../models/Doctor');

class DoctorController {

    static reportPage(req,res){
        res.render('doctor/report');
    }

    static rosterPage(req,res){
        res.render('doctor/roster');
    }

    static workhrsPage(req,res){
        res.render('doctor/workrs');
    }

    static prefPage(req,res){
        res.render('doctor/preferences');
    }

    static leavePage(req,res){
        res.render('doctor/leave');
    }

    static sendReport(req,res){

        const doctorId = req.session.user.id;
        doctor.submitReport(doctorId, req.body.report);

        console.log(req.session.user);
        res.render('doctor/dash', {message: "Your report was submitted", user_info:req.session.user});

    }

    static submitLeave(req,res){
        console.log(req.body);
        res.redirect('/')
    }

    static submitPreferences(req,res){

    }
}

module.exports = DoctorController;