const axios=require("axios");

async function verifyQuan(req,res,next) {
    const quan=Number(req.body?.quantity);
    const tot=Number(req.quantity);
    if(quan===undefined || quan===null || quan<0) return res.status(400).send("!! enter valid quantity !!");
    if(quan>tot) return res.status(400).send("!! not enough stock !!");
    next();
}

async function findUser(req,res,next){
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
            else return res.status(400).send("!! user not validated !!");
        } catch (error) {
            res.status(500).json({
                message: "User service request failed",
            });
        }
}

async function findProduct(req,res,next) {
    const id=req.body?.id;
    try{
        const response=await axios.get(`http://localhost:3000/product/products/${id}`);
        if(response.data.valid===false) return res.status(404).send(response.data.message);
        req.quantity=response.data.product.stock;
        next();
    }
    catch(err){
        
        return res.status(400).send("!! error occured with product service !!");
    }
}

module.exports={verifyQuan,findProduct,findUser};