import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.js";
import { validateSignUpData } from "../utils/validation.js";
import bcrypt from 'bcryptjs';
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";

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

    if(!user){
      return response.status(400).json({
        message: "Invalid Credentials",
        error: true,
        success: false
      })
    }

    if(user.status !== "Active"){
      return response.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false
      })
    }

    const isPasswordValid = await user.validatePassword(password)



  }catch(error){
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
