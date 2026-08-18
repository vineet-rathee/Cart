require("dotenv").config();
const express=require("express");
const server=require("express-http-proxy");

const app=express();

app.use("/auth",server("http://localhost:3001"));

app.listen(process.env.PORT,()=>{
    console.log(`👍 Gateway server is running at localHost ${process.env.PORT} `);
});
