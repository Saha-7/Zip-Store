import sendEmail from "../config/sendEmail";
import UserModel from "../models/user";
import { validateSignUpData } from "../utils/validation";
import bcrypt from 'bcrypt';

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



    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify Email from Zip-Store",
      html: 
    })
    

    response.json({
      message: "User created successfully", 
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
