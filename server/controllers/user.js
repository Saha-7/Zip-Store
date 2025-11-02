import sendEmail from "../config/sendEmail";
import UserModel from "../models/user";
import { validateSignUpData } from "../utils/validation";
import bcrypt from 'bcrypt';
import verifyEmailTemplate from "../utils/verifyEmailTemplate";

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

    const passwordHash = await bcrypt.hash(password, 13)

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
