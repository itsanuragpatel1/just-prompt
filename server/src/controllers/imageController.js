import { GoogleGenAI} from "@google/genai"; 
import { projectModel } from "../models/projectModel.js";
import { uploadImage } from "../utils/cloudinary.js";
import { imageModel } from "../models/imageModel.js";
import axios from 'axios';
import { FlyMyAI } from "flymyai-js-client";
import FormData from "form-data";


const editImage=async(req,res)=>{
    try {
        const {prompt,project}=req.body;
        const image=req.file.buffer;

        if(!prompt){
            res.status(400).json({success:false,message:"prompt is required"});
        }

        //image check

        // if not project create project
        if(!project){
            await projectModel.insertOne({userId:req.user,projectType:"Edit"})
        }



        const ai = new GoogleGenAI({});

        const imagePath = "path/to/cat_image.png";
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        const finalprompt = [
            { text: prompt},
            {
                inlineData: {
                    mimeType: "image/png",
                    data: base64Image,
                },
            },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: finalprompt,
        });
        

    } catch (error) {
        console.log("error in editImage controller",error);
        res.status(500).json({success:false,message:"editing image failed"})      
    }
};

const generateImage=async(req,res)=>{
    try {
        const {prompt}=req.body;
        
        const ai=new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
        });

        console.log(response)

        if(!response){
            res.status(500).json({success:false,message:"error in genraing image"})
        }

        res.status(200).json({success:true,response,message:"image generated"})


    } catch (error) {
        console.log("error in generateImage controller",error);
        res.status(500).json({success:false,message:"generating image failed"})     
    }
};

const base64ToBuffer=(base64)=>{
    const buffer=Buffer.from(base64,"base64");
    return buffer;
}

const BufferToBase64=(buffer)=>{
    const base64=buffer.toString("base64");
    return base64;
}

const imageUrlToBase64=async(imageUrl)=>{
    const {data}=await axios.get(imageUrl,{responseType:"arraybuffer"});
    const buffer=Buffer.from(data);
    const base64=BufferToBase64(buffer);
    return base64;
}

// const generateImageCall=async(prompt)=>{
//     //crate image and return the image url
//     const ai=new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash-image",
//         contents: prompt,
//     });

//       const parts = response.candidates[0].content.parts;

//   let base64Image = "";
//   for (const p of parts) {
//     if (p.inlineData) {
//       base64Image = p.inlineData.data;
//       break;
//     }
//   }

//     //suppose 
//     // const imageBase64=response.jkfkjdv.jckdfjkv; //to CHANGE
//     const imageBuffer=base64ToBuffer(imageBase64);
//     const imageUrl=await uploadImage(imageBuffer);
//     return imageUrl;
// };

// const editImageCall=async(imageUrl,prompt)=>{
//     const base64Image=await imageUrlToBase64(imageUrl);

//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//     const finalprompt = [
//         { text: prompt},
//         {
//             inlineData: {
//                 mimeType: "image/png",
//                 data: base64Image,
//             },
//         },
//     ];

//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash-image",
//         contents: finalprompt,
//     });

//       let newBase64 = "";
//   for (const part of response.candidates[0].content.parts) {
//     if (part.inlineData) {
//       newBase64 = part.inlineData.data;
//       break;
//     }
//   }


//     // const newBase64=response.jkfkjdv.jckdfjkv; //to CHANGE
//     const imageBuffer=base64ToBuffer(newBase64);
//     const newImageUrl=uploadImage(imageBuffer);
//     return newImageUrl;
// };

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://api.flymy.ai/api/v1/flymyai/nano-banana/predict',
//   headers: { 
//     'x-api-key': 'fly-VBj3sAS9Hx7tBFgGURMOUD7hYKlVag2cF8P9ncleET_9pOlW_JZ7tF68oixSf271', 
//     ...data.getHeaders()
//   },
//   data : data
// };





const generateImageCall=async(prompt)=>{
    //crate image and return the image url
    try {
        const data = new FormData();
        data.append("prompt", prompt);

        const response = await axios.post(
        "https://api.flymy.ai/api/v1/flymyai/nano-banana/predict",
        data,
        {
            headers: {
            "x-api-key": process.env.FLYMY_API_KEY
            }
        }
        );

        const raw = response.data;

        const jsonString = raw.replace(/^data:\s*/, "");

        const parsed = JSON.parse(jsonString);

        // const base64Image = parsed.output_data.image[0];
        const imageBase64 = parsed.output_data.image[0];

    //suppose 
    // const imageBase64=response.jkfkjdv.jckdfjkv; //to CHANGE
    const imageBuffer=base64ToBuffer(imageBase64);
    const imageUrl=await uploadImage(imageBuffer);
    return imageUrl.secure_url;
    } catch (error) {
        console.log("error in the generate image",error);
    }
};



const editImageCall=async(imageUrl,prompt)=>{
    try {
    const base64Image=await imageUrlToBase64(imageUrl);
    const buffer=await base64ToBuffer(base64Image);

    const data = new FormData();
    data.append("prompt", prompt);
    data.append("image", buffer, {
  filename: "image.jpg",       
  contentType: "image/jpeg",    
});

    const response = await axios.post(
      "https://api.flymy.ai/api/v1/flymyai/nano-banana/predict",
      data,
      {
        headers: {
          "x-api-key": process.env.FLYMY_API_KEY,
          ...data.getHeaders()
        },
         responseType: "stream",   
        timeout: 0,              
        maxBodyLength: Infinity
      }
    );

    let raw = "";
    for await (const chunk of response.data) {
      raw += chunk.toString("utf8");
    }

    const jsonString = raw
      .split("\n")
      .find(line => line.startsWith("data:"))
      ?.replace("data:", "")
      ?.trim();

    if (!jsonString) {
      throw new Error("No data payload received from FlyMyAI");
    }

    const parsed = JSON.parse(jsonString);


    const outputBase64 = parsed.output_data.image[0];
    if (!outputBase64) {
      throw new Error("No image returned from FlyMyAI");
    }

    const outputBuffer = Buffer.from(outputBase64, "base64");

    const uploaded = await uploadImage(outputBuffer);

    return uploaded.secure_url;
        
    } catch (error) {
        console.log("error in editImageCall ",error)
        
    }
 
};



const genImage=async(req,res)=>{
    try {
        const {prompt}=req.body;
        let {imageUrl,projectId}=req.body;

        const image=req.file?.buffer;

        const userId=req.user;

        if(!prompt){
            return res.status(500).json({success:false,message:"prompt required"})     
        }

        let isNewProject=false;

        if(!projectId){
            //from here we want the project id and the image link than normal procedure
            isNewProject=true;
            if(image){ //edit
                const imageData=await uploadImage(image);
                imageUrl=imageData.secure_url;
                const projectCreate=await projectModel.insertOne({userId,projectType:'Edit'});
                const imageObj=await imageModel.insertOne({imageUrl,type:"Upload",projectId:projectCreate._id});
                projectCreate.editHistory=[imageObj._id]
                await projectCreate.save();
                projectId=projectCreate._id;
            }else{ //generate
                const projectCreate=await projectModel.insertOne({projectType:'Generate',userId});
                console.log(projectCreate)
                projectId=projectCreate._id;
            }
        }

        let createdImageUrl=null;
        if(imageUrl){
            createdImageUrl=await editImageCall(imageUrl,prompt);
        }else{
            createdImageUrl=await generateImageCall(prompt);
        }

        const newImageObj=await imageModel.insertOne({projectId,prompt,imageUrl:createdImageUrl});

        const projectObjectGet=await projectModel.findById(projectId);
        projectObjectGet.editHistory.push(newImageObj._id);
        projectObjectGet.lastImageId=newImageObj;

        await projectObjectGet.save();

        const finalProject = await projectModel
        .findById(projectId)
        .populate('editHistory')
        .populate('lastImageId');

        res
        .status(200)
        .json({success:true,project:finalProject,isNewProject,message:"all Fine"});

        
    } catch (error) {
        console.log("error in gen Image controller",error);
        res.status(500).json({success:false,message:"generating image failed"})     
    }
};

export {editImage,generateImage,genImage}