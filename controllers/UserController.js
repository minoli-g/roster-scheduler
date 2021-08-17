
class UserController{
    
    static loginPage(req,res){
        res.render('login');
    }

    static login(req,res){

        /*take data from req body, validate and pass to user model to verify
        if validation/verification failed, display error
        else redirect to home page*/
        console.log(req.body);
        res.render('/')
    }
}

module.exports = UserController;