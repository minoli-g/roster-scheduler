bcrypt = require('bcrypt');
const Admin = require('../models/AdminModel');


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


    // static async addDoctor(req,res){

    //     if (await Admin.addDoctor(req.body.wardId,req.body.docId)){
    //         //success, show ward page
    //         res.redirect(`/admin/ward/${req.body.wardId}`);
    //     }
    //     else{
    //         //show error
    //         console.log("error");
    //         res.redirect(`add/${req.body.wardId}`);
    //     }
    // }

    static async addDoctor(req,res){

        const wardID = req.body.wardId;
        var IDs = Object.keys(req.body);
        IDs = IDs.slice(0,IDs.length-1);
 
         for (let x in IDs){
            Admin.addDoctorToWard(wardID,IDs[x]);
         }
 
        console.log(IDs);
        res.redirect(`/admin/ward/${wardID}`);
        return;
     }

    static async removeDoctorPage(req,res){

        var wardID = req.params.wid;
        const info = await Admin.getWardInfo(wardID);
        res.render('Admin/remove',{wardName: info.ward_name, wardId: wardID}); 
    }

    static async removeDoctor(req,res){

        if (await Admin.addDoctor(req.body.wardId,req.body.docId)){
            //success, show ward page
            res.redirect(`/admin/ward/${req.body.wardId}`);
        }
        else{
            //show error
            console.log("error");
            res.redirect(`add/${req.body.wardId}`);
        }
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