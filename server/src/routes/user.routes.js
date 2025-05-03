import express from 'express';
import { isAdmin, isLogedin } from '../middlewares/isAuthenticated.js';
import { addAddress, updateAddress, updateAvatar, updateUser } from '../controllers/user.controllers.js';
import { adminLogin, checkedUserLogin } from '../controllers/auth.controllers.js';


const userRouter = express.Router();

// update account
userRouter.patch('/update-profile', isLogedin, updateAvatar)
//update userDetails
userRouter.patch('/update-user', isLogedin, updateUser)
// update address
userRouter.patch('/update-address', isLogedin, updateAddress)
//update avatar
userRouter.patch('/update-avatar', isLogedin, updateAvatar);
//add address
userRouter.post('/add-address', isLogedin, addAddress)
// is login
userRouter.post('/is-login', checkedUserLogin)
// admin routes
userRouter.post('/admin',isAdmin,adminLogin)


export default userRouter;