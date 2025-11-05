import jwt from 'jsonwebtoken'


const generateRefreshToken = async(userId)=>{
    const token = await jwt.sign({
        id: userId},
        process.env.ACCESS_KEY,
        {expiresIn: '3d'}
    )

    return token
}

export default generateRefreshToken