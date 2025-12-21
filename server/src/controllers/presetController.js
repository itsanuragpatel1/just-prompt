import { presetModel } from "../models/presetModel.js";

const getAllPresets=async(req,res)=>{
    try {
        const presets=await presetModel.find().select('-prompt');
        
        res
        .status(200)
        .json({success:true,presets,message:"preset get successfull"})

    } catch (error) {
        console.log("error in getAllPreset",error);
        res
        .status(500)
        .json({success:false,message:"error in getting all preset"});
    }
}

export {getAllPresets};