import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "provide name"]
    },
    email:{
        type: String,
        required: [true, "provide email"]
    },
    password:{
        type: String,
        required: [true, "provide password"]
    },
    avatar:{
        type: String,
        default: ""
    },
    mobile:{
        type: Number,
        default: null
    },
    refresh_token:{
        type: String,
        default: ""
    },
    verify_email:{
        type: Boolean,
        default: false
    },
    last_login_date:{
        type: Date,
        default: ""
    },
    status:{
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },

    address_details: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Address'
    }],
    shopping_cart:[{
        type: mongoose.Schema.ObjectId,
        ref: 'CartProduct'
    }],
    orderHistory:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    }],

    forgot_password_otp:{
        type: String,
        default: null 
    },
    forgot_password_expiry:{
        type: Date,
        default: "" 
    },

    role:{
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    }


}, {timestamps: true})




userSchema.method.validatePassword = async function(inputPasswordByUser){
    const user = this
    const originalPassword = user.password

    const isPasswordValid = await bcrypt.compare(originalPassword, inputPasswordByUser)

    return isPasswordValid
}



const UserModel = mongoose.model("User", userSchema)


export default UserModel