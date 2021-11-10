bcrypt = require('bcrypt');
const { json } = require('express');
const Admin = require('../models/AdminModel');
const Roster = require('../roster/roster');
const date = require('date-and-time');

class AdminController{

    static async ghostSignupPage(req,res){
        console.log(process.env.ADMIN_KEY);
        res.render('ghost');
    }

    static async ghostSignup(req,res){

        const password = await bcrypt.hash(req.body.pwd1,10);

        var user_info = await user.getUserByUsername(req.body.username);
        user_info = user_info[0];

        var regReq = await user.checkRegReq(req.body.username);
        regReq = regReq[0];

        if (user_info || regReq) {
            res.render('ghost',{message: "Sorry, that username is taken"});
            return;
        }

        console.log(process.env.ADMIN_KEY);

        if (req.body.secretkey != process.env.ADMIN_KEY){
            console.log(req.body.secretkey);
            
            res.render('ghost',{message: "Incorrect key"});
            return;
        }

        await Admin.addNewUser( req.body.username, req.body.first_name,
            req.body.last_name, password, "admin");

        res.render('login',{message:"Success. You can now log in."})
        return;
    }

    static async addDoctorPage(req,res){
        
        var wardID = req.params.wid;
        const docs = await Admin.docsWithoutWards();

        
        const info = await Admin.getWardInfo(wardID);

        if(info){
        res.render('admin/add',{wardName: info.ward_name, wardId: wardID,
                                    doctors: docs}); 
        }
        else{
            res.redirect('/home');
        }
    }

    static async addDoctor(req,res){

        const wardID = req.body.wardId;
        var IDs = Object.keys(req.body);
        IDs = IDs.slice(0,IDs.length-1);
 
         for (let x in IDs){
            Admin.addDoctorToWard(wardID,IDs[x]);
         }

        res.redirect(`/admin/ward/${wardID}`);
        return;
     }

    static async removeDoctor(req,res){

        const wardID = req.body.wardId;
        const doctorID = req.body.doctorID;
        const done = await Admin.removeDoctorFromWard(doctorID);
        res.redirect(`/admin/ward/${wardID}`);
        return;
    }

    static async allWardsPage(req,res){

        const wards = await Admin.getAllWards();
        res.render('admin/allwards',{details: wards});

    }

    static async wardPage(req,res){

        const wardID = req.params.wid;        
        const info = await Admin.getWardInfo(wardID);

        if (info) {

            const docs = await Admin.getWardDoctors(wardID);
            res.render('admin/ward',{wardID: wardID,
                                      docs: docs,
                                      wardName: info.ward_name,
                                      min_docs: info.min_docs,
                                      morning_start: info.morning_start,
                                      day_start: info.day_start,
                                      night_start: info.night_start});
        }
        else{
            res.redirect('/home');
        }
    }

    static async allRostersPage(req,res){

        const wardID = req.params.wid;
        const wards = await Admin.getWardRosters(wardID);
        res.render('admin/rosters',{details: wards, id: wardID});

    }

    static async viewRoster(req,res){

        const wardID = req.params.wid;
        const year = req.params.y;
        const month = req.params.m;
        const roster = await Admin.getRoster(wardID,year,month);
        const rr = JSON.parse(roster.roster)
        res.render('admin/wardRoster',{details: roster, id: roster.ward_id, y:year, m:month, roster:rr});

    }

    static async createRoster(req,res,next){
        
        const wardID = req.body.wardID;

        const now = new Date();
        const nextMonth = date.addMonths(now,1)
        const thisYear =nextMonth.getFullYear();
        const thisMonth= nextMonth.getMonth()+1;

        const docsID = await Admin.getWardDoctorIDs(wardID);
        const docLeaves = await Admin.getWardDoctorLeaves(wardID,thisMonth,thisYear)
        const minDocs = await Admin.getWardInfo(wardID);
        const wards = await Admin.getWardRosters(wardID);   
        const monthRoster = await Admin.getRoster(wardID,thisYear,thisMonth); 
        
        const allDocs = [];
        const leaveDocs = [];
        const leaveDates = [];

        for (let x in docsID) {
            allDocs.push(docsID[x].user_id);
        }
        
        
        for (let x in docLeaves) {
            leaveDocs.push(docLeaves[x].user_id);
            leaveDates.push([docLeaves[x].prefered_date.getDate()]);
        }

        if (!monthRoster){
            const roster = await Roster.createRoster(minDocs.min_docs,allDocs,leaveDocs,leaveDates,wardID);
            
            res.redirect(`roster/${wardID}`);
            // next();
            return;

        } else if ((wardID == monthRoster.ward_id) && (thisYear == monthRoster.year) && (thisMonth == monthRoster.month)){
            res.render('admin/rosters',{message: "Sorry Roster already created.",details: wards, id: wardID}); 
            return;
        }

    }

    static async issuePage(req,res){

        const reports = await Admin.viewNewIssues();
        res.render('admin/issue',{messages: reports});
    }

    static async solveDoctorIssue(req,res){

        const issueID = req.body.issueID;
        const done = await Admin.solveIssues(issueID);
        res.redirect('issue');
        return;
    }

    static async newRegPage(req,res){

        const regs = await Admin.viewNewRegistration();
        res.render('admin/register',{messages: regs});
    }

    static async solveRegistration(req,res){
        const reqID = req.body.reqID;
        const details = await Admin.selectNewRegistration(reqID);
        const done = await Admin.addNewUser(details.username,details.first_name,details.last_name,details.password,details.type);
        const del = await Admin.deleteNewRegistration(reqID);
        res.redirect('register');
        return;

    }

    static async rejectRegistration(req,res){
        const reqID = req.body.reqID;
        const del = await Admin.deleteNewRegistration(reqID);
        res.redirect('register');
        return;
    }

    static async calculateWorkHours(req,res){

        const wardID = req.body.wardID;
        const docsID = await Admin.getWardDoctorIDs(wardID);
        const allDocs = [];

        for (let x in docsID) {
            allDocs.push(docsID[x].user_id);
        }

        const now = new Date();
        const nextMonth = date.addMonths(now,1)
        const thisYear =nextMonth.getFullYear();
        const thisMonth= nextMonth.getMonth()+1;

        const roster = await Admin.getRoster(wardID,thisYear,thisMonth);
        console.log(roster);
        const wards = await Admin.getWardRosters(wardID);
        const rr = JSON.parse(roster.roster)

        const doc = {id:0, Morning:[], Evening:[], Night:[]};

        const dd = [];

        for (let x in allDocs) {
            const doc = {id:0, Morning:0, Evening:0, Night:0};
            doc.id = allDocs[x];
            for (let i = 0; i < 31; i++) {
                if (JSON.stringify(Object.values(rr[`Day ${i+1}`]["Morning"])) === JSON.stringify([allDocs[x]])){
                    doc.Morning += 1;                    
                } else if (JSON.stringify(Object.values(rr[`Day ${i+1}`]["Evening"])) === JSON.stringify([allDocs[x]])){
                    doc.Evening += 1;                   
                } else if (JSON.stringify(Object.values(rr[`Day ${i+1}`]["Night"])) === JSON.stringify([allDocs[x]])){
                    doc.Night += 1;
                }
            }
            dd.push(doc)    
        }
        
        const ward = await Admin.getWardInfo(wardID);

        var morning = new Date(`2021-01-01 ${ward.morning_start}`);
        var day = new Date(`2021-01-01 ${ward.day_start}`);
        var night = new Date(`2021-01-01 ${ward.night_start}`);

        function getTimeDiff(startDate,endDate) {
            
            var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());

            var hh = Math.floor(timeDiff / 1000 / 60 / 60);   
            hh = ('0' + hh).slice(-2)
        
            timeDiff -= hh * 1000 * 60 * 60;
            var mm = Math.floor(timeDiff / 1000 / 60);
            mm = ('0' + mm).slice(-2)
            
            return (hh + "." + (mm/60)*100);
        }

        const m = parseFloat(getTimeDiff(morning,day));
        const d = parseFloat(getTimeDiff(day,night));
        const n = 24 - parseFloat(getTimeDiff(night,morning));
 

        for (let i = 0; i < dd.length ; i++){
            const wr = await Admin.getWorkHours(dd[i].id,thisMonth,thisYear);
            if(!wr){
                var hrs = dd[i].Morning*m + dd[i].Evening*d + dd[i].Night*n;
                const wrk = await Admin.addWorkHours(dd[i].id,thisMonth,thisYear,hrs);
                
            }
        }

        
        res.redirect(`roster/${wardID}`);
        
        // res.render('admin/rosters',{message: "Sorry Roster already created.",details: wards, id: wardID}); 
        return;
    }



}

module.exports = AdminController;