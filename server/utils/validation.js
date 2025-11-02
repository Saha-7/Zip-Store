import validator from 'validator'

export const validateSignUpData =(req)=>{
    const { name, email, password } = req.body

    if(!name){
        throw new Error("First name and last name are required");
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
}


