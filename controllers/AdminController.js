bcrypt = require('bcrypt');
const Admin = require('../models/AdminModel');


class AdminController{

    static async addDoctorPage(req,res){

        var wardID = req.params.wid;
        const info = await Admin.getWardInfo(wardID);
        res.render('Admin/add',{wardName: info.ward_name, wardId: wardID}); 
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


    static async wardPage(req,res){

        var wardID = req.params.wid;        
        const info = await Admin.getWardInfo(wardID);
        if (info) {
        res.render('admin/ward',{wardName: info.ward_name,
                                      min_docs: info.min_docs,
                                      morning_start: info.morning_start,
                                      day_start: info.day_start,
                                      night_start: info.night_start});
        }
        else{
            res.redirect('/home');
        }
    }

    static async acceptRegistration(req,res){
        const info = await Admin.viewNewIssues();
        res.render('admin/issue',{})    



    }

    static async rejectRegistration(req,res){

    }

    static async solveDoctorIssue(req,res){

    }



}

module.exports = AdminController;