require("dotenv").config();
const app=require("./src/app");
const mongoose=require("./src/configs/mongoose");

app.listen(process.env.PORT,(err)=>{
    console.log(`👍 Product server is running at port ${process.env.PORT}`);
});