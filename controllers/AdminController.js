bcrypt = require('bcrypt');
const { json } = require('express');
const Admin = require('../models/AdminModel');
const Roster = require('../roster/roster');
const date = require('date-and-time');

class AdminController{

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

    static async createRoster(req,res){
        
        const wardID = req.body.wardID;

        const now = new Date();
        const nextMonth = date.addMonths(now,1)
        const thisYear =now.getFullYear();
        const thisMonth= now.getMonth()+2;

        const docsID = await Admin.getWardDoctorIDs(wardID);
        const docLeaves = await Admin.getWardDoctorLeaves(wardID,thisMonth,thisYear)
        const minDocs = await Admin.getWardInfo(wardID);
        const wards = await Admin.getWardRosters(wardID);   
        const rr = await Admin.getRoster(wardID,thisYear,thisMonth); 

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

        if (!rr){
            const roster = await Roster.createRoster(minDocs.min_docs,allDocs,leaveDocs,leaveDates,wardID);
            res.redirect(`roster/${wardID}`);
            return;

        } else if ((wardID == rr.ward_id) && (thisYear == rr.year) && (thisMonth == rr.month)){
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





}

module.exports = AdminController;