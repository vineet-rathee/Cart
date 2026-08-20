const mongoose=require("mongoose");


const addressSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
    },
    pincode:{
        type:Number,
        required:true,
    },
    city:String,
    state:String,
    country:String,
},{timestamps:true});


module.exports=mongoose.model("address",addressSchema);