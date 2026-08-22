const cartModel=require("../models/cart.model");
const axios=require("axios");

async function addProdcut(req,res) {
    const user=req.id;
    const product=req.body?.id;
    const req_quantity=req.body?.quantity;

    let cart=await cartModel.findOne({user:user});
    if(!cart) cart=await cartModel.create({user});

    if(Number(req_quantity)===0) 
    {
        const temp =cart.products.filter(item=> item.product.toString()!==product.toString());
        cart.products=temp;
    }
    else {
        const temp=cart.products.find(item=> item.product.toString()===product.toString());
        if(temp){
            temp.quantity=req_quantity;
        } 
        else {
            cart.products.push({product:product,quantity:req_quantity});
        }
    }
    await cart.save();
    res.status(200).send(cart);
}

async function getCart(req,res) {
    const user=req.id;
    let cart=await cartModel.findOne({user});
    if(!cart) 
    {
        cart=await cartModel.create({user});
    }
    res.status(200).send(cart);
}

async function deleteProduct(req,res) {
    const user=req.id;
    const pro=req.body?.id;
    if(!pro) return res.status(400).send("!! enter a product id !!");
    let cart=await cartModel.findOne({user});
    if(!cart) cart= await cartModel.create({user});
    const temp=cart.products.find(product=>product.product.toString()===pro.toString());
    if(!temp) return res.status(200).json({
        message:"no product found",
        cart,
    })
    else 
    {
        cart.products=cart.products.filter(product=> product.product.toString()!==pro.toString());
        await cart.save();
        res.status(200).json({
        message:"product deleted",
        cart,
    })
    }
}

async function deleteCart(req,res) {
    const user=req.id;
    const cart=await cartModel.findOne({user});
    if(!cart) return res.status(200).send("No cart exists to delete");
    await cartModel.deleteOne({user});
    res.status(200).send("!! cart deleted !!");
}

async function amount(req,res){
    const user=req.id;
    const cart=await cartModel.findOne({user});
    let amount=0;
    if(!cart) return res.status(200).json({amount:0});
    for(let product of cart.products){
        try {
        const products = await Promise.all(
            cart.products.map(async (product) => {
                const url = `http://localhost:3000/product/products/${product.product}`;
                const response = await axios.get(url);
                if (response.data.valid === false) {
                    throw new Error(response.data.message);
                }
                return (
                    Number(response.data.product.price) *
                    Number(product.quantity)
                );
            })
        );
        const amount = products.reduce(
            (total, price) => total + price,
            0
        );
        return res.status(200).json({ amount });

        }catch (err) {
            return res.status(400).send(
                "!! error occured with product service !!"
            );
        }
    }
    res.status(200).json({amount});
}

module.exports={addProdcut,getCart,deleteProduct,deleteCart,amount};