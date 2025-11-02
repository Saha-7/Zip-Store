import {Router} from 'Express'
import { registerUserController } from '../controllers/user'


const userRouter=Router()

userRouter.post('/register', registerUserController)

export default userRouter
