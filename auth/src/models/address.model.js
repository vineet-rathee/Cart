const mongoose=require("mongoose");

const addressSchema= new mongoose.Schema({
    pincode:{
        type:Number,
        required:true,
    },
    city:String,
    state:String,
    country:String,
},{timestamps:true});

module.exports=mongoose.model("address",addressSchema);