import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js';
import { projectModel } from '../models/projectModel.js';
import { imageModel } from '../models/imageModel.js';

const getUser=async(req,res)=>{
    try {
        const {accessToken}=req.cookies;

        if(!accessToken){
            return res.status(400).json({success:false,message:"accessToken not present"})
        }

        const {userId}=jwt.verify(accessToken,process.env.JWT_SECRET);

        if(!userId){
            return res.status(400).json({success:false,message:"userId not present"})
        }

        const user=await userModel.findById(userId);

        if(!user){
            return res.status(400).json({success:false,message:"user not found"})
        }
        
        const userObj=user.toObject();

        delete userObj.password;
        delete userObj.refreshToken;
        
        res
        .status(200)
        .json({success:true,user:userObj,message:"user get successfully"})

    } catch (error) {
        console.log("error in getUser controller",error);
        res.status(500).json({success:false,message:"User not get"})      
    }
}


const projects=async(req,res)=>{
    try {
        const userId=req.user;
        const type=req.params.type;

        let projects;
        if(type=="all"){
            projects=await projectModel.find({userId});
        }else{
            projects=await projectModel.find({userId,projectType:type});
        }
        
        res.status(200)
        .json({success:true,message:"project successfully fetched",projects})


    } catch (error) {
        console.log("error in projects controller",error);
        res.status(500).json({success:false,message:"can not get projects"})      
    }
};


const getProfile=async(req,res)=>{
    try {
        const userId=req.user;

    const user = await userModel.findById(userId).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const projects = await projectModel.find({ userId }).select("_id");

    const projectIds = projects.map(p => p._id);

    const projectsCount=projects.length;

    let imagesCount = 0;

    const counts=await imageModel.find({projectId:{$in:projectIds},type:{$ne:"Upload"}}).countDocuments();

    const userObj=user.toObject();

    userObj.imagesCount=counts;
    userObj.projectsCount=projectsCount;

    res.status(200).json({success: true,message: "Profile fetched successfully", userObj});

    } catch (error) {
        console.log("error in getProfile controller",error);
        res.status(500).json({success:false,message:"error in getting profile"})        
    }
};

const getAllImages = async (req, res) => {
  try {
    const userId = req.user;

    // Get user's projects
    const projects = await projectModel
      .find({ userId })
      .select("_id");

    const projectIds = projects.map(p => p._id);

    // Get all images
    const images = await imageModel
      .find({ projectId: { $in: projectIds } , type: { $ne: "Upload" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({success: true,count: images.length,images});

  } catch (error) {
    console.error("getAllUserImages error:", error);
    return res.status(500).json({success: false,message: "Failed to fetch images"});
  }
};


const getGeneratedImages = async (req, res) => {
  try {
    const userId = req.user;

    // Get user's projects
    const projects = await projectModel
      .find({ userId , projectType: "Generate" })
      .select("_id");

    const projectIds = projects.map(p => p._id);

    // Only generated images
    const images = await imageModel
      .find({projectId: { $in: projectIds }})
      .sort({ createdAt: -1 });

    return res.status(200).json({success: true,count: images.length,images});

  } catch (error) {
    console.error("getGeneratedImages error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch generated images"
    });
  }
};


const getEditedImages = async (req, res) => {
  try {
    const userId = req.user;

    // Get user's projects
    const projects = await projectModel
      .find({ userId, projectType:"Edit" })
      .select("_id");

    const projectIds = projects.map(p => p._id);

    // Edited images based on image.type
    const images = await imageModel
      .find({ projectId: { $in: projectIds }, type: { $ne: "Upload" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({success: true,count: images.length,images});

  } catch (error) {
    console.error("getEditedImages error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch edited images"
    });
  }
};


const getAllProjects = async (req, res) => {
  try {
    const userId = req.user;

    const projects = await projectModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .populate({
        path: "lastImageId",
        model: imageModel,
        select: "imageUrl",
      });

    const formattedProjects = projects.map((project) => ({
      ...project.toObject(),
      lastImage: project.lastImageId,
    }));

    return res.status(200).json({
      success: true,
      count: formattedProjects.length,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("getAllProjects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

const getEditProjects = async (req, res) => {
  try {
    const userId = req.user;

    const projects = await projectModel
      .find({
        userId,
        projectType: { $in: ["Edit", "Preset"] },
      })
      .sort({ updatedAt: -1 })
      .populate({
        path: "lastImageId",
        model: imageModel,
        select: "imageUrl",
      });

    const formattedProjects = projects.map((project) => ({
      ...project.toObject(),
      lastImage: project.lastImageId,
    }));

    return res.status(200).json({
      success: true,
      count: formattedProjects.length,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("getEditProjects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch edit projects",
    });
  }
};

const getGenerateProjects = async (req, res) => {
  try {
    const userId = req.user;

    const projects = await projectModel
      .find({
        userId,
        projectType: "Generate",
      })
      .sort({ updatedAt: -1 })
      .populate({
        path: "lastImageId",
        model: imageModel,
        select: "imageUrl",
      });

    const formattedProjects = projects.map((project) => ({
      ...project.toObject(),
      lastImage: project.lastImageId,
    }));

    return res.status(200).json({
      success: true,
      count: formattedProjects.length,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("getGenerateProjects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch generated projects",
    });
  }
};

export {getUser,projects,getProfile,getAllImages,getEditedImages,getGeneratedImages,getAllProjects,getGenerateProjects,getEditProjects};