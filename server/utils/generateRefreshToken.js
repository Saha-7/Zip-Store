import jwt from 'jsonwebtoken'
import UserModel from '../models/user.js'


const generateRefreshToken = async(userId)=>{
    const token = await jwt.sign({
        id: userId},
        process.env.ACCESS_KEY,
        {expiresIn: '3d'}
    )

    await UserModel.updateOne(
        {_id: userId},
        {$set: {refresh_token: token}}
    )

    return token
}

export default generateRefreshToken