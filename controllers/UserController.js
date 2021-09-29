bcrypt = require('bcrypt');

user = require('../models/User');

const { body, validationResult } = require('express-validator');

class UserController{
    
    static loginPage(req,res){
        res.render('login');
    }

    static homePage(req,res){

        switch(req.session.user.type){
            case("consultant"):
                res.render('consultant/dash',{user_info:req.session.user});
                break;

            case("admin"):
                res.render('home', {username: req.session.user.username});
                break;

            case("doctor"):
                res.render('home', {username: req.session.user.username});
                break;
            
        }
        //res.render('home', {username: req.session.user.username});
        return;
    }

    static signupPage(req,res){
        res.render('signup');
    }

    static async signup(req,res){

        const error = validationResult(req);
        if(!error.isEmpty()){
            res.render('signup',{message:error.errors[0].msg});
        }

        const password = await bcrypt.hash(req.body.pwd1,10);

        //console.log(await bcrypt.compare(req.body.pwd1,password));

        var user_info = await user.getUserByUsername(req.body.username);
        user_info = user_info[0];

        var regReq = await user.checkRegReq(req.body.username);
        regReq = regReq[0];

        if (user_info || regReq) {
            //throw error saying no such username
            res.render('signup',{message: "Sorry, that username is taken"});
            return;
        }

        user.submitRegReq(req.body.first_name,
                        req.body.last_name,
                        req.body.username,
                        req.body.type,
                        password);
        res.redirect('/');
        return;
    }

    static async login(req,res){

        /*take data from req body, validate and pass to user model to verify
        if validation/verification failed, display error
        else redirect to home page*/

        var user_info = await user.getUserByUsername(req.body.username);
        user_info = user_info[0];

        if (!user_info) {

            var regReq = await user.checkRegReq(req.body.username);
            regReq = regReq[0];

            if(regReq) {
                res.render('login',{message: "Sorry, your request is still pending"});
                return;
            }
            //throw error saying no such username
            res.render('login',{message: "This user does not exist"});
            return;
        }

        const match = await bcrypt.compare(req.body.password,user_info.password);

        if(!match) {
            //throw error saying incorrect password
            res.render('login',{message: "Incorrect password"});
            return;
        }

        //Store all the user info in the session
        req.session.user = {};  //clear session data
        req.session.user.id = user_info.user_id;
        req.session.user.username = user_info.username;
        req.session.user.first_name = user_info.first_name;
        req.session.user.last_name = user_info.last_name;
        req.session.user.type = user_info.type;

        //res.send("home");
        res.redirect('/home');
    }

    static async logout(req,res){

        req.session.user = undefined;
        res.redirect('/');
    }
}

module.exports = UserController;