bcrypt = require('bcrypt');

consultant = require('../models/Consultant')

class ConsultantController{

    static createWardPage(req,res){
        res.render('consultant/create');
    }

    static addDoctorPage(req,res){}
    
    static changeParamsPage(req,res){}

    static leaveAppPage(req,res){}

    static wardPage(req,res){
        var wardID = req.params.wid;
        //get data from model about ward
        //render that data
        //res.render('consultant/ward',{wardName: })
    }

    static async createWard(req,res){
        //check if ward name and start month valid

        if (consultant.getWardID(req.body.wardname)) {
            //throw error saying ward name taken
            console.log("That name's taken");
        }

        //insert ward info into DB table 
        //get ID of the ward

        //redirect to that ward's page
        res.redirect('/ward/:wid');
        
    }

}

module.exports = ConsultantController;