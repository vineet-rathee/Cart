const axios=require("axios");


async function getUser(req,res,next) {
    const token=req.cookies?.token;
    try {
        const response = await axios.get(
        "http://localhost:3000/auth/getUser",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(response.data.valid==="true") 
        {
            req.id=response.data.id;
            req.role=response.data.role;
            next();
        }
    } catch (error) {
        console.log(response);
        res.status(500).json({
            message: "User service request failed",
        });
    }
};

async function verifytoken(req,res,next) {
    const token=req.cookies?.token;
    try{
        const response=await axios.get(
        "http://localhost:3000/auth/verifytoken",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )
    if(response.data.valid==="true")
    {
        req.id=response.data.id;
        next();
    }
    else return res.status(401).send("!! authentication failed !!")
    }
    catch(err){
        res.status(400).send("!! error while calling user microservice !!");
    }
}


module.exports={getUser,verifytoken};