const validateSignUpData =(req)=>{
    const { name, email, password } = req.body

    if(!name){
        throw new Error("First name and last name are required");
    }else if(!validato)
}