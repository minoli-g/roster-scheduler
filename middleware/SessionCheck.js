const ifLoggedIn = (req,res,next) => {
    if (req.session.user){
        next();
    }
    else {
        res.redirect('/');
    }
};

const ifNotLoggedIn = (req,res,next) => {
    if (!req.session.user){
        next();
    }
    else{
        res.redirect('/home');
    }
}

module.exports.ifLoggedIn = ifLoggedIn;
module.exports.ifNotLoggedIn = ifNotLoggedIn;