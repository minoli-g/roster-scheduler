user = require('../models/User');

class UserController{
    
    static loginPage(req,res){
        res.render('login');
    }

    static homePage(req,res){
        res.render('home', {username: req.session.user});
        console.log(req.session.user);
    }

    static async login(req,res){

        /*take data from req body, validate and pass to user model to verify
        if validation/verification failed, display error
        else redirect to home page*/

        const user_info = await user.getUserByUsername(req.body.username);

        if (!user_info) {
            //throw error saying no such username
        }
        req.session.user = user_info[0].username;

        //res.send("home");
        res.redirect('/home');
    }
}

module.exports = UserController;