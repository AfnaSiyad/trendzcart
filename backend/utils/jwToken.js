const jwt = require("jsonwebtoken");

exports.getToken = async (req,res,next)=>{
     
const options = {
    id:req.user._id,
    time:Date.now()
}

const token = await jwt.sign(options,process.env.JWT_SECRET_KEY,{expiresIn:'1d'});

if(!token){
    return res.status(500).json({
        success:false,
        message:"Token generation failed",
        isAuthenticated:false,
    })
}

res.status(200).cookie("token",token, {
    httpOnly: true, 
    secure: true, 
    sameSite: 'None', 
}).json({
    success:true,
    user:req.user,
    token,
    message:"Logged in successfully",
    isAuthenticated:true,
})
}