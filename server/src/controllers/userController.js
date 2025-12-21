import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js';
import { projectModel } from '../models/projectModel.js';

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

    const projects = await projectModel.find({ userId }, "editHistory");

    const projectsCount=projects.length;

    let imagesCount = 0;
    projects.forEach(project => {
      imagesCount += project.editHistory?.length || 0;
    });

    const userObj=user.toObject();

    userObj.imagesCount=imagesCount;
    userObj.projectsCount=projectsCount;

    res.status(200).json({success: true,message: "Profile fetched successfully", userObj});

    } catch (error) {
        console.log("error in getProfile controller",error);
        res.status(500).json({success:false,message:"error in getting profile"})        
    }
};


export {getUser,projects,getProfile};