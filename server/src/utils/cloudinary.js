import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

cloudinary.config(process.env.CLOUDINARY_URL);

const uploadImage=async(fileBuffer)=>{
    // try{
    //     const uploadResult=await cloudinary.uploader.upload(filePath,{folder:'carRental'});
    //     // console.log(uploadResult)
    //     return uploadResult;
    // }catch(error){
    //     console.log("upload error" , error);
    // }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'carRental' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

}

export {uploadImage}