const Consultant = require('../models/Consultant');

bcrypt = require('bcrypt');

class ConsultantController{

    static createWardPage(req,res){
        res.render('consultant/create');
    }

    static addDoctorPage(req,res){}
    
    static changeParamsPage(req,res){}

    static leaveAppPage(req,res){}

    static async wardPage(req,res){

        var wardID = req.params.wid;
        
        const info = await Consultant.getWardInfo(wardID);

        res.render('consultant/ward',{wardName: info.ward_name})  //TODO - add the rest of the info
    }

    static async createWard(req,res){
        //check if ward name and start month valid

        if (!(await Consultant.getWardID(req.body.wardname)===undefined)) {
            //throw error saying ward name taken
            console.log("That name's taken");
            return;
        }

        //compare current date with month given
        const startMonth = new Date(req.body.startmonth);

        if (!(startMonth>new Date())){
            console.log("Invalid Month");
            return;
        }

        //insert ward info into DB table and get ID of the ward

        //const userId = req.session.user.id;

        const insertWard = await 
        Consultant.createWard(req.body.wardname,101,startMonth.getMonth(),startMonth.getFullYear());


        //redirect to that ward's page
        res.redirect(`/consultant/ward/${insertWard}`);

        //res.redirect('/');
        
    }

}

module.exports = ConsultantController;