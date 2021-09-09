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

const isConsultant = (req,res,next) => {
    if (req.session.user.type=="consultant"){
        next();
    }
    else{
        res.redirect('/home');
    }
}

const isDoctor = (req,res,next) => {
    if (req.session.user.type=="doctor"){
        next();
    }
    else{
        res.redirect('/home');
    }
}

const isAdmin = (req,res,next) => {
    if (req.session.user.type=="admin"){
        next();
    }
    else{
        res.redirect('/home');
    }
}

module.exports.ifLoggedIn = ifLoggedIn;
module.exports.ifNotLoggedIn = ifNotLoggedIn;
module.exports.isConsultant = isConsultant;
module.exports.isDoctor = isDoctor;
module.exports.isAdmin = isAdmin;