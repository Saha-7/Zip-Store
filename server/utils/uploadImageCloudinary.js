import { v2 as cloudinary } from 'cloudinary'


const uploadImageCloudinary = async(image)=>{
    const buffer = Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((reslove, reject)=>{
        cloudinary.uploader.upload_stream({folder: "Zip Store"}, (error, uploadResult)=>{
            return reslove(uploadResult)
        }).end(buffer)
    })
    return uploadImage
}


export default uploadImageCloudinary