import { GoogleGenAI } from "@google/genai";
import { projectModel } from "../models/projectModel.js";
import { uploadImage } from "../utils/cloudinary.js";
import { imageModel } from "../models/imageModel.js";
import axios from 'axios';
import { FlyMyAI } from "flymyai-js-client";
import FormData from "form-data";


const base64ToBuffer = (base64) => {
    const buffer = Buffer.from(base64, "base64");
    return buffer;
}

const BufferToBase64 = (buffer) => {
    const base64 = buffer.toString("base64");
    return base64;
}

const imageUrlToBase64 = async (imageUrl) => {
    const { data } = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data);
    const base64 = BufferToBase64(buffer);
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


const generateImageCall = async (prompt) => {
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
        const imageBuffer = base64ToBuffer(imageBase64);
        const imageUrl = await uploadImage(imageBuffer);
        return imageUrl.secure_url;
    } catch (error) {
        console.log("error in the generate image", error);
    }
};

const editImageCall = async (imageUrl, prompt) => {
    try {
        const base64Image = await imageUrlToBase64(imageUrl);
        const buffer = await base64ToBuffer(base64Image);

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
        console.log("error in editImageCall ", error)

    }

};

const genImage = async (req, res) => {
    try {
        const { prompt , upscale } = req.body;
        let { imageUrl, projectId } = req.body;

        const image = req.file?.buffer;

        const userId = req.user;

        const user = await userModel.findById(userId);

    if (user.plan === "free" && user.imageCredits <= 0) {
      return res.status(403).json({success: false,message: "Free limit reached."});
    }

        if (!prompt && !upscale) {
            return res.status(400).json({ success: false, message: "prompt required" })
        }

        let isNewProject = false;
        let imageObj = null;

        if (imageUrl) {
            imageObj = await imageModel.findOne({ imageUrl });
        }


        if (!projectId) {
            //from here we want the project id and the image link than normal procedure
            isNewProject = true;
            if (image) { //edit
                const imageData = await uploadImage(image);
                imageUrl = imageData.secure_url;
                const projectCreate = await projectModel.insertOne({ userId, projectType: 'Edit' });
                imageObj = await imageModel.insertOne({ imageUrl, type: "Upload", projectId: projectCreate._id });
                projectCreate.editHistory = [imageObj._id]
                await projectCreate.save();
                projectId = projectCreate._id;
            } else { //generate
                const projectCreate = await projectModel.insertOne({ projectType: 'Generate', userId });
                console.log(projectCreate)
                projectId = projectCreate._id;
            }
        }

        let createdImageUrl = null;
        if (imageUrl) {
            if(upscale){
            createdImageUrl= await upscaleImage(imageUrl);
            }else{
            createdImageUrl = await editImageCall(imageUrl, prompt);
            }
        } else {
            createdImageUrl = await generateImageCall(prompt);
        }

        const newImageObj = await imageModel.insertOne({ projectId, prompt, imageUrl: createdImageUrl, ...(imageObj && { parentImage: imageObj._id }) });

        const projectObjectGet = await projectModel.findById(projectId);
        projectObjectGet.editHistory.push(newImageObj._id);
        projectObjectGet.lastImageId = newImageObj;

        await projectObjectGet.save();

    if (user.plan === "free") {
      user.imageCredits -= 1;
      await user.save();
    }

        const finalProject = await projectModel
            .findById(projectId)
            .populate('editHistory')
            .populate('lastImageId');

        res
            .status(200)
            .json({ success: true, project: finalProject, isNewProject,remainingCredits: user.imageCredits, message: "all Fine" });


    } catch (error) {
        console.log("error in gen Image controller", error);
        res.status(500).json({ success: false, message: "generating image failed" })
    }
};


const reRun = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        const imageInfo = await imageModel.findOne({ imageUrl }).populate("parentImage");

        if (!imageInfo) {
            return res.json({ success: false, message: "Image not exist" })
        }

        return res.json({ success: true, prompt: imageInfo.prompt, imageUrl: imageInfo.parentImage.imageUrl })

    } catch (error) {
        console.log("error in re Run controller", error);
        res.status(500).json({ success: false, message: "generating image failed" })

    }
}

const urlToCloudinaryUrl=async(url)=>{
    try {
        const arraybuffer=(await axios.get(url,{responseType:"arraybuffer"})).data;
        const buffer=Buffer.from(arraybuffer);
        const result=await uploadImage(buffer);
        return result.secure_url;
    } catch (error) {
        console.log("error in urlToCloudinaryUrl", error);
    }
}

const swapFaces = async (sourceUrl, targetUrl) => {
    const sourceBuffer = (await axios.get(sourceUrl, { responseType: 'arraybuffer' })).data;
    const targetBuffer = (await axios.get(targetUrl, { responseType: 'arraybuffer' })).data;

    const form = new FormData();
    form.append('srcimage', sourceBuffer, 'source.jpg');
    form.append('targetimage', targetBuffer, 'target.jpg');
    form.append('enhance', 'true');

    const res = await axios.post('https://aiapi.aiphotocraft.com/api/faceswap/basicswap', form, {
        headers: { ...form.getHeaders(), 'X-Api-Key': process.env.PHOTOCRAFT_API_KEY }
    });

    const taskId = res.data.task_id;

    while (true) {
        const statusRes = await axios.get(`https://aiapi.aiphotocraft.com/api/task-status/${taskId}`, {
            headers: { 'X-Api-Key': process.env.PHOTOCRAFT_API_KEY }
        });

        if (statusRes.data.status === 'completed') {
            return statusRes.data.result;
        } else if (statusRes.data.status === 'failed') {
            throw new Error(`Task failed: ${statusRes.data.message || 'Unknown error'}`);
        }

        // Wait 3 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
};

const fixFace = async (req, res) => {
    try {
        //face fix karna hai 
        //project milna chahiye aur project type edit hona chahiye
        //imageurl milna chahiye jisme edit karna hai 

        const { projectId, imageUrl } = req.body;
        const userId = req.user;

        if(!projectId || !imageUrl){
            return res.status(400).json({success:false,message:"projectId and imageUrl are required"})
        }

        const project = await projectModel.findById(projectId).populate("editHistory");

        if (!project) {
            return res.json({ success: false, message: "Project Not Found" });
        }

        if (userId.toString() !== project.userId.toString()) {
            return res.status(403).json({success: false,message: "Unauthorized user"});
        }

        if (project.projectType !== "Edit") {
            return res.json({ success: false, message: "Fix Face not supported for this project type" })
        }

        let faceImageUrl = project.editHistory[0]?.imageUrl;

        // let imageObj=await imageUrl.find({imageUrl});

        const imageObj = project.editHistory.find((imgObj) => imgObj.imageUrl == imageUrl);

        if (!imageObj) {
            return res.status(400).json({success: false,message: "Image not found in project history"});
        }

        const fixedFaceUrl =await swapFaces(imageObj.imageUrl, faceImageUrl);

        const fixedFaceUrl1=await urlToCloudinaryUrl(fixedFaceUrl);

        //image obj banao
        //project update
        //parent me daalo 

        const fixedFaceImageObj=await imageModel.create({projectId,imageUrl:fixedFaceUrl1,parentImage:imageObj._id,type:"Edit"});

        project.lastImageId=fixedFaceImageObj._id;;
        project.editHistory.push(fixedFaceImageObj._id);


        await project.save();

        const finalProject = await projectModel
            .findById(projectId)
            .populate('editHistory')
            .populate('lastImageId');
    
        return res.json({success:true,project:finalProject});

    } catch (error) {
        console.log("error in fix face controller", error);
        res.status(500).json({ success: false, message: "Fix Face failed" })

    }
}

const upscaleImage = async (imageUrl, options = {}) => {
    const {
        upscaleFactor = '200%',      // 2x upscale (most common)
        method = 'smart_enhance',    // Best quality for photos
        outputFormat = 'jpeg',       // Web-optimized
        quality = 90,                // High quality, good compression
        sharpen = 20                 // Subtle sharpening post-upscale
    } = options;

    const apiKey = process.env.CLAID_API_KEY;

    try {
        const response = await axios.post('https://api.claid.ai/v1-beta1/image/edit', {
            input: imageUrl,
            operations: {
                resizing: {
                    width: upscaleFactor,    // "200%" = 2x original width
                    height: upscaleFactor    // Maintains aspect ratio
                },
                restorations: {
                    upscale: method         // AI upscaling model
                },
                adjustments: {
                    sharpness: sharpen      // Post-processing sharpening
                }
            },
            output: {
                format: {
                    type: outputFormat,
                    quality: quality
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const url=response.data.data.output.tmp_url;
        
        const finalUrl=await urlToCloudinaryUrl(url);

        return finalUrl;
    } catch (error) {
        throw new Error(`Upscale failed: ${error.response?.data?.message || error.message}`);
    }
};


const upscale=async(req,res)=>{
    try {
        upscaleImage("https://res.cloudinary.com/dmg0a7wv7/image/upload/v1766668830/carRental/ceom6osn4cwccrbdpnua.png");
    } catch (error) {
        console.log("error in upscale ",error);
        res.json({success:false,message:"error"})
    }
}



export { genImage, reRun , fixFace,upscale};