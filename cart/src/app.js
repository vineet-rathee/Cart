const express=require("express");
const cookie=require("cookie-parser");
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

const cartRoute=require("./routes/cart.routes");

app.use("/",cartRoute);

module.exports=app;
