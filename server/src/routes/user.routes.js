import express from 'express';
import { isLogedin } from '../middlewares/isAuthenticated.js';
import { addAddress, updateAddress, updateAvatar, updateUser } from '../controllers/user.controllers.js';


const userRouter = express.Router();

// update account
userRouter.patch('/update-profile', isLogedin, updateAvatar)
//update userDetails
userRouter.patch('/update-user', isLogedin, updateUser)
// update address
userRouter.patch('/update-address', isLogedin, updateAddress)
//add address
userRouter.post('/add-address', isLogedin, addAddress)


export default userRouter;