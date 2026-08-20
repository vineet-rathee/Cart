const express= require("express");
const route=express.Router();

const middleware=require("../middleware/auth.middleware");
const controller=require("../controller/auth.controller");

route.post("/register",middleware.register,controller.register);
route.post("/login",middleware.login,controller.login);
route.post("/logout",middleware.authenticator,controller.logout);
route.post("/change",controller.changePassword);
route.get("/me",middleware.authenticator,controller.me);
route.post("/add",middleware.authenticator,controller.address);
route.patch("/update",middleware.authenticator,controller.update);
route.get("/address",middleware.authenticator,controller.addresses);

//internal routes
route.get("/getUser",middleware.authenticator,(req,res)=>{
    res.status(200).json(
        {
            valid:"true",
            id:req.id,
            role:req.role,
            email:req.email,
        }
    );});
route.get("/getuser/:id",controller.getUser);
route.get("/verifytoken",middleware.authenticator,(req,res)=>{res.status(200).json({valid:"true",id:req.id})});

module.exports=route;