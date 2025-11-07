import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.js";
import { validateSignUpData } from "../utils/validation.js";
import bcrypt from 'bcryptjs';
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"
const saltRounds = 13

export async function registerUserController(request, response) {
  try {

    validateSignUpData(request)

    const { name, email, password } = request.body;
    
    const oldUser = await UserModel.findOne({email})
    // If user exist
    if(oldUser){
        return response.json({
            message: "Email already exist",
            error: true,
            success: false
        })
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)

    // creating instance of user model
    const user = new UserModel({
      name,
      email,
      password: passwordHash
    })

    // Save user to DB
    const savedUser = await user.save()


    // Verification email url
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser?._id}`



    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify Email from Zip-Store",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl
      })
    })
    

    response.json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: savedUser
    })

  } catch (err) {
    return response.status(500).json({
      message: err.message || err,
      error: true,
      success: true,
    });
  }
}


export async function verifyEmailController(req, res){
  try{
    // taking the id
    const {id} = req.body

    // matching that id with respected user in the db
    const user = await UserModel.findOne({_id: id})

    if(!user){
      return response.status(400).json({
        message: "Invalid Code",
        error: true,
        success: false
      })
    }

    const updateUser = await UserModel.updateOne({
      verify_email: true
    })

    return res.json({
      message: "Email verified",
      success: true,
      error: false,
      data: updateUser
    })


  }catch(error){
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
}


// LogIn controller
export async function loginController(req,res){
  try{
    const {email, password} = req.body
    const user = await UserModel.findOne({email})

    if(!email || !password){
      return res.status(400).json({
        message: "Email & password both required",
        error: true,
        success: false
      })
    }

    if(!user){
      return res.status(400).json({
        message: "Invalid Credentials",
        error: true,
        success: false
      })
    }

    if(user.status !== "Active"){
      return res.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false
      })
    }

    const isPasswordValid = await user.validatePassword(password)

    if(!isPasswordValid){
      return res.status(400).json({
        message: "Check your password",
        error: true,
        success: false
      })
    }

    //creating the token
    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)

    const cookies_Option = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }

    res.cookie('accessToken', accessToken, cookies_Option)
    res.cookie('refreshToken', refreshToken, cookies_Option)

    return res.status(200).json({
      message: "Login Successful",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken
      }
    })

  }catch(error){
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


// Log out controller
export async function logoutController(request, response){
  try{

    const userid = request.userId

    const cookies_Option = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }

    response.clearCookie("accessToken", cookies_Option)
    response.clearCookie("refreshToken", cookies_Option)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(
  userid,
  { refresh_token: "" },  // Second parameter is the update
  { new: true }           // Third parameter is options
)

// Log to verify
    console.log("After logout - DB refresh_token:", removeRefreshToken)

    return response.json({
      message: "Log Out successful",
      error: false,
      success: true
    })

  }catch(error){
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}



//Upload user avatar
export async function uploadAvatar(request,response){
  try{
    const image = request.file
    const upload = await uploadImageCloudinary(image)
    console.log("upload", upload)

    return response.json({
      message: "upload_profile",
      data: upload
    })

  }catch(error){
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}