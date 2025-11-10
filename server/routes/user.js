import {Router} from 'express'
import { forgotPassword, loginController, logoutController, registerUserController, updateUserDetails, uploadAvatar, verifyEmailController, verifyOTPforgotPassword } from '../controllers/user.js'
import auth from '../middlewares/auth.js'
import upload from '../middlewares/multer.js'


const userRouter=Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout',auth, logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUserDetails)
userRouter.put('/forgot-password', forgotPassword)
userRouter.put('/verify-otp', verifyOTPforgotPassword)


export default userRouter
