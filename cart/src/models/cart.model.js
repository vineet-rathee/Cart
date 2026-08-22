const mongoose=require("mongoose");
const { product } = require("../../../product/src/controllers/product.controller");

const cart=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        index:true,
        unique:true,
    },
    products:{
        type:[{
            product:{
                type:mongoose.Schema.ObjectId,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
                min:1,
                default:1,
            },
        }],
    }
    
},{timestamps:true});

module.exports=mongoose.model("cart",cart);