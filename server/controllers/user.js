import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.js";
import { validateSignUpData } from "../utils/validation.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOTP from "../utils/generateOTP.js";
import forgotPasswordTemplate from "../utils/forgotpasswordTemplate.js";
import jwt from "jsonwebtoken"
const saltRounds = 13;

export async function registerUserController(request, response) {
  try {
    validateSignUpData(request);

    const { name, email, password } = request.body;

    const oldUser = await UserModel.findOne({ email });
    // If user exist
    if (oldUser) {
      return response.json({
        message: "Email already exist",
        error: true,
        success: false,
      });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    // creating instance of user model
    const user = new UserModel({
      name,
      email,
      password: passwordHash,
    });

    // Save user to DB
    const savedUser = await user.save();

    // Verification email url
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify Email from Zip-Store",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    response.json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: savedUser,
    });
  } catch (err) {
    return response.status(500).json({
      message: err.message || err,
      error: true,
      success: true,
    });
  }
}



export async function verifyEmailController(req, res) {
  try {
    // taking the id
    const { id } = req.body;

    // matching that id with respected user in the db
    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      return response.status(400).json({
        message: "Invalid Code",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne({
      verify_email: true,
    });

    return res.json({
      message: "Email verified",
      success: true,
      error: false,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
}



// LogIn controller
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!email || !password) {
      return res.status(400).json({
        message: "Email & password both required",
        error: true,
        success: false,
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false,
      });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    //creating the token
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookies_Option = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookies_Option);
    res.cookie("refreshToken", refreshToken, cookies_Option);

    return res.status(200).json({
      message: "Login Successful",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



// Log out controller
export async function logoutController(request, response) {
  try {
    const userid = request.userId;

    const cookies_Option = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.clearCookie("accessToken", cookies_Option);
    response.clearCookie("refreshToken", cookies_Option);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(
      userid,
      { refresh_token: "" }, // Second parameter is the update
      { new: true } // Third parameter is options
    );

    // Log to verify
    console.log("After logout - DB refresh_token:", removeRefreshToken);

    return response.json({
      message: "Log Out successful",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



//Upload user avatar
export async function uploadAvatar(request, response) {
  try {
    // getting the logged users ID
    const userid = request.userId; //coming from auth middleware

    const image = request.file; // coming from multer middleware
    const upload = await uploadImageCloudinary(image);
    console.log("upload", upload);

    await UserModel.findByIdAndUpdate(userid, { avatar: upload?.url });

    return response.json({
      message: "upload_profile",
      data: {
        _id: userid,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



// update user details
export async function updateUserDetails(request, response) {
  try {
    const id = request.userId; //  from auth middleware
    const { name, email, mobile, password } = request.body;

    let passwordHash = "";
    if (password) {
      const passwordHash = await bcrypt.hash(password, saltRounds);
    }

    const updateUserDetails = await UserModel.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: passwordHash }),
      },
      { new: true }
    );

    return response.status(200).json({
      message: "User Details updated successfully",
      error: false,
      success: true,
      data: updateUserDetails,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



// Forgot password API without login
export async function forgotPassword(request, response) {
  try {
    const { email } = request.body;
    // Using mail finding the user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email Not Available",
        error: true,
        success: false,
      });
    }

    // generate the OTP
    const otp = generatedOTP();
    const expireTime = new Date() + 60 * 60 * 1000; // 1hour

    // Updating in the DB
    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    // sending Mail
    await sendEmail({
      sendTo: email,
      subject: "Forgot Password from Zip Store",
      html: forgotPasswordTemplate({ name: user.name, otp: otp }),
    });

    return response.json({
      message: "Check Your Email",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



// OTP verify for Forgot password API without login
export async function verifyOTPforgotPassword(request, response) {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide Email & OTP",
        error: true,
        success: false,
      });
    }
    // Finding user by email
    const user = await UserModel.findOne({ email });
    // If user is not in the DB
    if (!user) {
      return response.status(400).json({
        message: "Provide Email & OTP",
        error: true,
        success: false,
      });
    }

    const current_Time = new Date().toISOString()

    if (current_Time> user.forgot_password_expiry){
      return response.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    // Matching the OTP of mail with DB otp
    if(otp!==user?.forgot_password_otp){
      return response.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })

    return response.status(200).json({
      message: "OTP verified Successfully",
      error: false,
      success: true
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



// reset-password API
export async function resetPassword(request, response){
  try{
    const {email, newPassword, confirmPassword} = request.body

    if(!email || !newPassword || !confirmPassword){
      return response.status(400).json({
        message: "All fields are required",
      })
    }

    const user = await UserModel.findOne({email})

    if(!user){
      return response.status().json({
        message: "Email not available",
        error: true,
        success: false
      })
    }

    if(newPassword !== confirmPassword){
      return response.status(400).json({
        message: "New Password & Confirm Password should match",
        error: true,
        success: false
      })
    }

    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const update = await UserModel.findByIdAndUpdate(user._id, {
      password: passwordHash,
    })

    return response.json({
      message: "Password update successful",
      error: false,
      success: true
    })
  }catch(error){

  }
}




// refresh token controller
export async function refreshToken(request, response) {
  try{
    const refreshToken = request.cookies.refreshToken || request?.header?.authorization?.split(" ")[1]  // [Bearer token 1st element]

    if (!refreshToken){
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false
      })
    }

    //console.log("refresh token: ", refreshToken)

    const verifyToken = await jwt.verify(refreshToken, process.env.REFRESH_KEY)
    // If token expired or null or wrong token
    if(!verifyToken){
      return response.status(401).json({
        message: "Invalid Token",
        error: true,
        success: false
      })
    }

  }catch(error){
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}
