import jwt, { decode } from 'jsonwebtoken'
import { userModel } from '../models/userModel.js';

const auth=async(req,res,next)=>{
    try {
            const {accessToken}=req.cookies;
        
            if(!accessToken){
                return res.status(400).json({success:false,message:"not authorised"});
            }
        
            const decoded=jwt.verify(accessToken,process.env.JWT_SECRET);
        
            const user=await userModel.findById(decoded.userId);
        
            if(!user){
                return res.status(400).json({success:false,message:"not authorised"});
            }
            
            req.user=user._id;
        
            next();

    } catch (error) {
        console.log("error in auth middleware",error);
        return res.status(401).json({success: false,message: "Unauthorized: Invalid or expired token"});
    }
}

export {auth}