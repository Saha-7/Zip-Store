import UserModel from "../models/user";

export async function registerUser(request, response) {
  try {
    const { name, email, password } = request.body;
    if(!name || !email || !password){
        return response.status(400).json({
            message: "Provide all the fields",
            error: true,
            success: false
        })
    }
    const user = await UserModel.findOne({email})
    // If user exist
    if(user){
        return response.json({
            message: "Email already exist",
            error: true,
            success: false
        })
    }
  } catch (err) {
    return response.status(500).json({
      message: err.message || err,
      error: true,
      success: true,
    });
  }
}
