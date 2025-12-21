import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    email:{type:String,required:true,trim:true},
    otp:{type:String,required:true},
    expiry:{type:Date} 
},{timestamps:true})

// otpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

const otpModel=mongoose.model('otp',otpSchema);

export {otpModel};
