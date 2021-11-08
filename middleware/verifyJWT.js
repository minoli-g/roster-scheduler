const jwt=require('jsonwebtoken');

const verifyjwt=(req,res,next)=>{
    const token= req.headers["x-access-token"];
    if(!token){
        res.status(401).json({err: " Hi, we need a token"});
    }else{
        jwt.verify(token,"jwttoken",(err,decoded)=>{
            if(err){
               return res.status("401").json({auth: false, message: "You failed to authenticate"});
            }else{
                req.user=decoded.id;
                return next();
            }
        })
    }
}
module.exports=verifyjwt