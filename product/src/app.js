const express=require("express");
const cookies=require("cookie-parser");

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookies());

const productRoute=require("./routes/products.route");

app.use("/",productRoute);
module.exports=app;