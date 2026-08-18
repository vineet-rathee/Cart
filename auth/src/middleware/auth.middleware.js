const userModel=require("../models/user.model");
const tokenModel=require("../models/token.model");
const jwt=require("jsonwebtoken");

async function register(req,res,next) {
    const {name,email,role,password}=req.body||{};
    if(!name || !email || !password) return res.status(400).json({message:"!! provide all deatils to register !!"});

    const user=await userModel.findOne({email});
    if(user) return res.status(409).json({message:"user already eists with given email"});

    next();
}

async function login(req,res,next) {
    const {email,password}=req.body||{};
    if(!password || !email) return res.status(400).json({message:"!! provide all deatils to login !!"});

    const user=await userModel.findOne({email});
    if(!user) return res.status(404).json({message:"!! no user found !!"});
    const pass=await user.checkPassword(password);
    if(pass) next();
    else return res.status(401).json({message:"!! wrong password !!"});
}

async function authenticator(req,res,next){
    const token=req.cookies.token;
    if(!token) return res.status(401).send("!! login to use this api !!");
    try{
        const decoded=jwt.verify(token,process.env.JWT);
        req.email=decoded.mail;
        req.id=decoded.id;
        next();
    }
    catch(err){
        return res.status(401).json({message:"!! user is not logged in !!"});
    }
}

async function blacklist_token(req,res,next){
    const token=req.cookies.token;
    if(token) 
    {
        const temp=await tokenModel.create({token});
    }
    next();
}

async function check_token(req,res,next) {
    const token=req.cookies.token;
    if(!token) next();
    const temp=await tokenModel.findOne({token});
    if(temp) return res.status(401).send("!! invalid token log in again !!");
    next();
}

module.exports={register,login,authenticator,blacklist_token,check_token};