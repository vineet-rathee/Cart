const express=require("express");
const cookie=require("cookie-parser");
const authRoute=require("./routes/auth.routes")

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

app.use("/",authRoute);

module.exports=app;
