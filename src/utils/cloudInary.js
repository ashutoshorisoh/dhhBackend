import { v2 as cloudinary } from 'cloudinary';

import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET

});

const uploadOnCloudinary= async(localFilePath)=>{
    try{
        if(!localFilePath) return null; // if files local path not present then return nothing

        const response = await cloudinary.uploader.upload
        (localFilePath, {
            resource_type: "auto"
        }) // keep the uploaded file in response, which will be uploaded when return function comes
        console.log("file uploaded on cloudinary", response.url) //url of file in console log just for developer perspective
        fs.unlinkSync(localFilePath)
        return response; //file uploaded
        
    } catch(error){
        fs.unlinkSync(localFilePath) //incase of upload failed or half uplaoded, it will be removed from local sever
        return null;
    }
}

export {uploadOnCloudinary}

