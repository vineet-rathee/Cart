const express=require("express");
const cookie=require("cookie-parser");
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

module.exports=app;
