import express from 'express';
import { checkedUserLogin } from '../controllers/auth.controllers.js';


const authRouter = express.Router();

authRouter.post('/is-login',checkedUserLogin);

export default authRouter;