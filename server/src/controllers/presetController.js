import { presetModel } from "../models/presetModel.js";


const getAllPresets=async(req,res)=>{
    try {
        const presets=await presetModel.find();
        
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

const addPresets = async (req, res) => {
  try {
    const { presets } = req.body;

    if (!Array.isArray(presets) || presets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Presets array is required",
      });
    }

    const formattedPresets = presets.map((preset) => {
      if (!preset.prompt || !preset.image) {
        throw new Error("Each preset must contain prompt and image");
      }

      return {
        prompt: preset.prompt.trim(),
        image: preset.image,
      };
    });

    const savedPresets = await presetModel.insertMany(formattedPresets);

    return res.status(201).json({
      success: true,
      message: "Presets saved successfully",
      data: savedPresets,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save presets",
    });
  }
};


export {getAllPresets,addPresets};