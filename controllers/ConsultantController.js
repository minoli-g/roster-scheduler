const Consultant = require('../models/Consultant');
const { body, validationResult } = require('express-validator');

//Use input validation for ward creation, parameter setting.

class ConsultantController{

    static createWardPage(req,res){
        res.render('consultant/create');
    }

    static async addDoctorPage(req,res){

        const docs = await Consultant.docsWithoutWards();

        var wardID = req.params.wid;
        const info = await Consultant.getWardInfo(wardID);
        if(info){
        res.render('consultant/add',{wardName: info.ward_name, wardId: wardID,
                                    doctors: docs}); 
        }
        else{
            res.redirect('/home');
        }
    }

    static async leaveAppPage(req,res){

        const consultantID = req.session.user.id;
        const leaves = await Consultant.getLeaveApps(consultantID);
        res.render('consultant/leaves',{applications: leaves});
    }

    static async reportMsgPage(req,res){

        const consultantID = req.session.user.id;
        const reports = await Consultant.getReports(consultantID);
        res.render('reports',{messages: reports});

    }

    static async wardPage(req,res){

        var wardID = req.params.wid;        
        const info = await Consultant.getWardInfo(wardID);
        if (info) {
        res.render('consultant/ward',{wardID: wardID,
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

    static async changeParamsPage(req,res){

        var wardID = req.params.wid;
        const info = await Consultant.getWardInfo(wardID);
        if (info) {
        res.render('consultant/edit',{wardName: info.ward_name,
                                    wardId: wardID,
                                    min_docs: info.min_docs,
                                    morning_start: info.morning_start,
                                    day_start: info.day_start,
                                    night_start: info.night_start}); 
        }
        else{
            res.redirect('/home');
        }
        
    }

    static async createWard(req,res){
        //check if ward name and start month valid

        const error = validationResult(req);
        if(!error.isEmpty()){
            res.render('consultant/create', {message:error.errors[0].msg});
            return;
        }

        const wardID = await Consultant.getWardID(req.body.wardname);
        console.log(wardID);

        if (wardID){
            res.render('consultant/create',{message: "That name's taken"});
            return;
        }

        //insert ward info into DB table and get ID of the ward

        const userId = req.session.user.id;
        const startMonth = new Date(req.body.startmonth);

        const insertWard = await 
        Consultant.createWard(req.body.wardname,userId,startMonth.getMonth(),startMonth.getFullYear());

        res.redirect(`/consultant/ward/${insertWard}`);
        return;
        
    }

    static async addDoctor(req,res){

      
       const wardID = req.body.wardId;
       var IDs = Object.keys(req.body);
       IDs = IDs.slice(0,IDs.length-1);

        for (let x in IDs){
            Consultant.addDoctor(wardID,IDs[x]);
        }

       console.log(IDs);
       res.redirect(`/consultant/ward/${wardID}`);
       return;
    }


    static async editParams(req,res){

        const error = validationResult(req);
        if(!error.isEmpty()){
            //reload the edit page showing error message

            if(req.body.wardId){
                const info = await Consultant.getWardInfo(req.body.wardId);
                if (info) {
                res.render('consultant/edit',{wardName: info.ward_name,
                                    wardId: req.body.wardId,
                                    min_docs: info.min_docs,
                                    morning_start: info.morning_start,
                                    day_start: info.day_start,
                                    night_start: info.night_start,
                                    message:error.errors[0].msg});
                return;
                }
            }
            res.redirect('/home');
            return;
        }

        Consultant.editWard(req.body.wardId,
                            req.body.min_docs,
                            req.body.morning_start,
                            req.body.day_start,
                            req.body.night_start);
        res.redirect(`/consultant/ward/${req.body.wardId}`);
    }

    static async resolveIssue(req,res){

        const issueID = req.body.issueID;
        const done = await Consultant.markReport(issueID);
        res.redirect('/consultant/reports');
        return;
    }

    static async updateLeave(req,res){

        const leaveID = req.body.leaveID;
        const update = await Consultant.updateLeave(leaveID);
        res.redirect('/consultant/leaves');
        return;
    }
}

module.exports = ConsultantController;