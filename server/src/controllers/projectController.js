import { projectModel } from "../models/projectModel.js";

const getProject=async(req,res)=>{
    try {
        const {projectId}=req.params;
        const userId=req.user;

        const project=await projectModel.findById(projectId).populate('editHistory').populate('lastImageId');
        if(!project){
            return res.status(400).json({success:false,message:"Project not Found"});
        }

        if(project.userId.toString() !=  userId.toString()){
            return res.status(400).json({success:false,message:"Not Authorised Access Project"})
        } 

        res.status(200).json({success:true,project,message:"Project Fetched Successfully"})

    } catch (error) {
        console.log("error in get Project controller",error);
        res.status(500).json({success:false,message:"error in getting project"})        
     
    }
}

export {getProject}