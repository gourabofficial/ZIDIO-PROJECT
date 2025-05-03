
import express from 'express';
import {  filterProduct, getAllProducts, getProductById, searchProduct, } from '../controllers/product.controllers.js';

const productRouter = express.Router();

// Only keep these GET routes for public access
productRouter.get('/get-products', getAllProducts);
productRouter.get('/get-product/:id', getProductById);
productRouter.get('/search', searchProduct);
productRouter.get('/filter', filterProduct);

export default productRouter;