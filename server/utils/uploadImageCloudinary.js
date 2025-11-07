import { v2 as cloudinary } from 'cloudinary'


// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });


const uploadImageCloudinary = async(image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((reslove, reject)=>{
        cloudinary.uploader.upload_stream({folder: "Zip Store"}, (error, uploadResult)=>{
            return reslove(uploadResult)
        }).end(buffer)
    })
    return uploadImage
}


export default uploadImageCloudinary