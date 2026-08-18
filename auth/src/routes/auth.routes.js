const express= require("express");
const route=express.Router();

const middleware=require("../middleware/auth.middleware");
const controller=require("../controller/auth.controller");

route.post("/register",middleware.blacklist_token,middleware.register,controller.register);
route.post("/login",middleware.blacklist_token,middleware.login,controller.login);
route.post("/logout",middleware.blacklist_token,controller.logout);
route.post("/change",middleware.check_token,controller.changePassword);
route.get("/me",middleware.check_token,middleware.authenticator,controller.me);
route.post("/add",middleware.check_token,middleware.authenticator,controller.address);
route.patch("/update",middleware.check_token,middleware.authenticator,controller.update);

module.exports=route;