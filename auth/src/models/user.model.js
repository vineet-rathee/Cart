const mongoose =require("mongoose");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    role: {
        type: String,
        enum: ["CUSTOMER", "SELLER", "ADMIN", "SUPER_ADMIN", "DELIVERY_AGENT"],
        default: "CUSTOMER"
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    address:[{
        type:mongoose.Schema.ObjectId,
        ref:"address",
    }]
},{timestamps:true,});

userSchema.pre("save",async function () {
    if(!this.isModified("password")) return;
    const hashed=await bcrypt.hash(this.password,10);
    this.password=hashed;
})

userSchema.methods.checkPassword=async function (pass) {
    return bcrypt.compare(pass,this.password);
};

module.exports=mongoose.model("user",userSchema);