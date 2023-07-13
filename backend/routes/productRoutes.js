import express from 'express';
import { createProduct, createProductReview, deleteProductById, getProductById, getProducts, getTopProducts, updateProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js'
const productRouter = express.Router();

productRouter.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct)

productRouter.route('/top').get(getTopProducts);
                        
productRouter.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProductById)

productRouter.route('/:id/reviews') 
  .post(protect, createProductReview)

export default productRouter;