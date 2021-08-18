bcrypt = require('bcrypt');

user = require('../models/User');

class UserController{
    
    static loginPage(req,res){
        res.render('login');
    }

    static homePage(req,res){
        res.render('home', {username: req.session.user.username});
    }

    static async login(req,res){

        /*take data from req body, validate and pass to user model to verify
        if validation/verification failed, display error
        else redirect to home page*/

        var user_info = await user.getUserByUsername(req.body.username);
        user_info = user_info[0];

        if (!user_info) {
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