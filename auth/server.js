require("dotenv").config();
const app=require("./src/app");
const mongoose=require("./src/configs/mongoose");
const http=require("http");

const server=http.createServer(app);

server.listen(process.env.PORT,()=>{
    console.log(`👍 Auth server is running at port ${process.env.PORT}`)
})
