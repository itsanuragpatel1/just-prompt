import { userModel } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { otpModel } from "../models/otpModel.js";
import { sendOtpMail } from "../utils/sendEmail.js";
import axios from 'axios'

const generateAccessToken=async(userId)=>{
    const accessToken=await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_ACCESS_EXPIRY});
    return accessToken;
}

const generateRefrehToken=async()=>{

}

const signup=async(req,res)=>{
    try {
        const {fullName,email,password}=req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({success:false,message:"Please Fill all field"});
        }

        if(password.length<8){
            return res.status(400).json({success:false,message:"Password length should be min of 8 digit"})
        }

        const userexist=await userModel.findOne({email});
        if(userexist){
            return res.status(400).json({success:false,message:"User Already Exist"});
        }

        const hashPassword=await bcrypt.hash(password,7);

        const user=await userModel.insertOne({fullName,email,password:hashPassword});

        if(!user){
            return res.status(500).json({success:false,message:"error in creating error please try again"});
        }

        //jwt token
        const accessToken=await generateAccessToken(user._id);

        const options={
            httpOnly:true,
            sameSite:"none",
            secure:true
        }

        res
        .cookie('accessToken',accessToken,options)
        .status(200)
        .json({success:true,user,message:"User Registerd Succesfully"});   
        
    } catch (error) {
        console.log("error in signup controller",error);
        res.status(500).json({success:false,message:"User not registered"})
    }
}

const sendOtp=async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email){
            return res.status(400).json({success:false,message:"Please Fill Email"});
        }

        const userexist=await userModel.findOne({email});
        if(userexist){
            return res.status(400).json({success:false,message:"User Already Exist"});
        }

        //generate otp
        const otp=(Math.floor(Math.random()*900000)+100000).toString();

        //store otp
        const hashOtp=await bcrypt.hash(otp,7);

        await otpModel.deleteMany({email});
        const otpdata=await otpModel.insertOne({email,otp:hashOtp,expiry: Date.now() + 1000*60*5});

        if(!otpdata){
            return res.status(400).json({success:false,message:"Error in Generating Otp"});
        }
        //send otp
        await sendOtpMail(email,otp);

        res
        .status(200)
        .json({success:true,message:"Otp sent Succesfully"});   
        
        
    } catch (error) {
        console.log("Error in Send Otp controller",error);
        res.status(500).json({success:false,message:"User not registered"}) 
    }
}

const verifyOtp=async(req,res)=>{
    try {
        const {fullName,email,password,otp}=req.body;

        if(!fullName || !email || !password || !otp){
            return res.status(400).json({success:false,message:"Please Fill all field"});
        }

        const otpDetail=await otpModel.findOne({email});

        if(Date.now()>otpDetail.expiry){
            return res.status(400).json({success:false,message:"OTP Expired"});
        }

        const isValid=await bcrypt.compare(otp,otpDetail.otp);

        if(!isValid){
            return res.status(400).json({success:false,message:"Incorrect OTP"});
        }

        if(password.length<8){
            return res.status(400).json({success:false,message:"Password length should be min of 8 digit"})
        }

        const hashPassword=await bcrypt.hash(password,7);

        const user=await userModel.insertOne({fullName,email,password:hashPassword});

        if(!user){
            return res.status(500).json({success:false,message:"error in creating error please try again"});
        }

        //jwt token
        const accessToken=await generateAccessToken(user._id);

        const options={
            httpOnly:true,
            sameSite:"none",
            secure:true
        }

        const userObj=user.toObject();

        delete userObj.password;
        delete userObj.refreshToken;
        
        res
        .cookie('accessToken',accessToken,options)
        .status(200)
        .json({success:true,user:userObj,message:"User Registerd Succesfully"});   
        
        
    } catch (error) {
        console.log("Error in Verify Otp controller",error);
        res.status(500).json({success:false,message:"User not registered"}) 
    }
}




const login=async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({success:false,message:"Please Fill all Field"});
        }

        const user=await userModel.findOne({email});

        if(!user){
            return res.status(400).json({success:false,message:"Accound not Exist"});
        }

        const isValidPassword=await bcrypt.compare(password,user.password);

        if(!isValidPassword){
            return res.status(400).json({success:false,message:"Wrong Password"});
        }

        const accessToken=await generateAccessToken(user._id);

        const options={
            httpOnly:true,
            sameSite:"none",
            secure:true
        }

        const userObj=user.toObject();

        delete userObj.password;
        delete userObj.refreshToken;

        res
        .cookie("accessToken",accessToken,options)
        .status(200)
        .json({success:true,user:userObj,message:"Login Successfully"})    
        
    } catch (error) {
        console.log("error in login controller",error);
        res.status(500).json({success:false,message:"login failed"})   
    }
}


const logout=async(req,res)=>{
    try {

        const options={
            httpOnly:true,
            sameSite:'none',
            secure:true
        }
        
        res
        .clearCookie("accessToken")
        .json({success:true,message:"Logout Succesfully"})
        
    } catch (error) {
        console.log("error in logout controller",error);
        res.status(500).json({success:false,message:"logout failed"})  
    }

}


const googleLogin=async(req,res)=>{
    try {
        const googleAuthURL =
            "https://accounts.google.com/o/oauth2/v2/auth?" +
            `client_id=${process.env.GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
            "&response_type=code" +
            "&scope=openid profile email";

        res.redirect(googleAuthURL);

    } catch (error) {
        console.log("error in google login controller",error);
    }
}

const googleCallBack=async(req,res)=>{

    const code=req.query.code;

    try {
   // Exchange code for access_token + id_token
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code"
      }
    );

    console.log(data);

    const { id_token } = data;

    // Decode ID token → contains user info
    const googleUser = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );

    const {name,email,picture}=googleUser;

    const user=await userModel.findOne({email});

    if(!user){
        const user=await userModel.insertOne({fullName:name,email,avatar:picture});
    }

    const accessToken=await generateAccessToken(user._id);

        const options={
            httpOnly:true,
            sameSite:"none",
            secure:true
        }

    res.cookie("accessToken",accessToken,options)

    res.redirect(`${process.env.FRONTEND_URL}/`)
        
    } catch (error) {
        console.log("error in google call back controller",error);
    }
}


export {signup,login,logout,sendOtp,verifyOtp,googleLogin,googleCallBack}