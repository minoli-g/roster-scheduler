const Consultant = require('../models/Consultant');
const { body, validationResult } = require('express-validator');

//Use input validation for ward creation, parameter setting.

class ConsultantController{

    static createWardPage(req,res){
        res.render('consultant/create');
    }

    static async addDoctorPage(req,res){

        //change this to display list of all doctors without wards, and hide their IDs.

        var wardID = req.params.wid;
        const info = await Consultant.getWardInfo(wardID);
        if(info){
        res.render('consultant/add',{wardName: info.ward_name, wardId: wardID}); 
        }
        else{
            res.redirect('/home');
        }
    }

    static leaveAppPage(req,res){}

    static reportMsgPage(req,res){}

    static async wardPage(req,res){

        var wardID = req.params.wid;        
        const info = await Consultant.getWardInfo(wardID);
        if (info) {
        res.render('consultant/ward',{wardName: info.ward_name,
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
            //throw error saying ward name taken
            console.log("That name's taken");
            res.render('consultant/create',{message: "That name's taken"});
            return;
        }

        //compare current date with month given
        const startMonth = new Date(req.body.startmonth);

        if (!(startMonth>new Date())){
            console.log("Invalid Month");
            res.render('consultant/create',{message: "Invalid start month"});
            return;
        }

        //insert ward info into DB table and get ID of the ward

        const userId = req.session.user.id;

        const insertWard = await 
        Consultant.createWard(req.body.wardname,userId,startMonth.getMonth(),startMonth.getFullYear());


        //redirect to that ward's page
        res.redirect(`/consultant/ward/${insertWard}`);
        return;

        //res.redirect('/');
        
    }

    static async addDoctor(req,res){
        /*
        if (await Consultant.addDoctor(req.body.wardId,req.body.docId)){
            //success, show ward page
            res.redirect(`/consultant/ward/${req.body.wardId}`);
        }
        else{
            //show error
            console.log("error");
            res.redirect(`add/${req.body.wardId}`);
        }
        */
       const doctorID = req.body.docId;
       const wardID = req.body.wardId;

       const ward_info = await Consultant.getWardInfo(wardID);

       if(ward_info){

            if (!await Consultant.doctorExists(doctorID)){
                res.render('consultant/add',{wardName: ward_info.ward_name, wardId: wardID, 
                    message: "Doctor ID invalid"});
            }
            if(await Consultant.doctorHasWard(doctorID)){
                res.render('consultant/add',{wardName: ward_info.ward_name, wardId: wardID, 
                    message: "Doctor has been assigned to a ward"});
            }

            Consultant.addDoctor(wardID,doctorID);
            res.redirect(`/consultant/ward/${req.body.wardId}`);

       }

        
    }

    static async editParams(req,res){

        Consultant.editWard(req.body.wardId,
                            req.body.min_docs,
                            req.body.morning_start,
                            req.body.day_start,
                            req.body.night_start);
        res.redirect(`/consultant/ward/${req.body.wardId}`);
    }

}

module.exports = ConsultantController;