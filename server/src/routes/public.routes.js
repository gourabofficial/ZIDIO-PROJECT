import express from 'express';
import { getHomeContent } from '../controllers/admin.controllers';



const publicRouter = express.Router();

publicRouter.get('/get-homecontent', getHomeContent)

export default publicRouter;