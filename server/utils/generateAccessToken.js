import jwt from 'jsonwebtoken'

const generateAccessToken = async(userId)=>{
    const token = await jwt.sign({id: userId}, process.env.ACCESS_KEY, {expiresIn: '1d'})
    return token
}

export default generateAccessToken