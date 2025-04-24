import express from 'express';
import { addProduct, filterProduct, getAllProducts, getProductById, removeProduct, searchProduct, updateProduct } from '../controllers/product.controllers.js';

const productRouter = express.Router();


// add product
productRouter.get('/add-product', addProduct);
// remove product
productRouter.get('/remove-product', removeProduct);
//update product
productRouter.get('/update-product', updateProduct)
// get all products
productRouter.get('/get-products', getAllProducts);
// get product by id
productRouter.get('/get-product/:id', getProductById);
//search product
productRouter.get('/search', searchProduct);
//filter product
productRouter.get('/filter', filterProduct);



export default productRouter;