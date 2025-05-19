import express from 'express';
import { isLogedin } from '../middlewares/isAuthenticated.js';
import { addToWishlist, removeFromWishlist } from '../controllers/user.controllers.js';

const wishlistRouter = express.Router();


//wishlist routes
wishlistRouter.post('/add-to-wishlist', isLogedin, addToWishlist);
wishlistRouter.delete('/remove-from-wishlist/:productId', isLogedin, removeFromWishlist);

export default wishlistRouter;