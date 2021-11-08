const Consultant = require('../models/Consultant');
const { body, validationResult } = require('express-validator');  //Use input validation for ward creation, parameter setting.

class ConsultantController{

    static createWardPage(req,res){
        res.render('consultant/create');
    }

    static async addDoctorPage(req,res){

        const docs = await Consultant.docsWithoutWards();
        const consultantID = req.session.user.id;

        var wardID = req.params.wid;
        const info = await Consultant.getWardOfConsultant(wardID,consultantID);

        if(info){
        res.render('consultant/add',{wardName: info.ward_name, wardId: wardID,
                                    doctors: docs}); 
        }
        else{
            res.redirect('/home');
        }
    }

    static async leaveAppPage(req,res){

        //const consultantID = req.session.user.id;
        //const leaves = await Consultant.getLeaveApps(consultantID);
        //res.render('consultant/leaves',{applications: leaves});
        res.render('consultant/leaves');

    }

    static async reportMsgPage(req,res){

        const consultantID = req.session.user.id;
        const reports = await Consultant.getReports(consultantID);
        res.render('reports',{messages: reports});

    }

    static async wardPage(req,res){

        const wardID = req.params.wid;        
        const consultantID = req.session.user.id;

        const info = await Consultant.getWardOfConsultant(wardID,consultantID); //ensures that consultant has permission to access this ward

        if (info) {

            const docs = await Consultant.docsInWard(wardID);
            res.render('consultant/ward',{wardID: wardID,
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

    static async changeParamsPage(req,res){

        var wardID = req.params.wid;
        const consultantID = req.session.user.id;

        const info = await Consultant.getWardOfConsultant(wardID,consultantID);
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

    static async allWardsPage(req,res){

        const consultantID = req.session.user.id;
        const wards = await Consultant.allWards(consultantID);
        console.log(wards);
        res.render('consultant/allwards',{details: wards});

    }

    static async createWard(req,res){
        //check if ward name and start month valid

        const error = validationResult(req);

        if(!error.isEmpty()){
            res.render('consultant/create', {message:error.errors[0].msg});
            return;
        }

        const wardID = await Consultant.getWardID(req.body.wardname);

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

    static async allRostersPage(req,res){

        const wardID = req.params.wid;
        const wards = await Consultant.getWardRosters(wardID);
        res.render('consultant/rosters',{details: wards, id: wardID});

    }

    static async viewRoster(req,res){

        const wardID = req.params.wid;
        const year = req.params.y;
        const month = req.params.m;
        const roster = await Consultant.getRoster(wardID,year,month);
        const rr = JSON.parse(roster.roster)
        res.render('consultant/wardRoster',{details: roster, id: roster.ward_id, y:year, m:month, roster:rr});

    }






}

module.exports = ConsultantController;