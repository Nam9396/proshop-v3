import Product from "../model/productModel.js";
import customError from '../utils/customError.js';

const getProducts = async(req, res, next) => {
  const documentsPerPage = process.env.PAGINATION_LIMIT; 
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword 
   ? { name: { $regex: req.query.keyword, $options: 'i' } }
   : {}
  
  const documentsCount = await Product.countDocuments({...keyword}); // truong huong dan la {...keyword}

    const products = await Product.find({...keyword})
    .limit(documentsPerPage)
    .skip(documentsPerPage * (page - 1));

    if (products) { 
      return res.json({ 
        products: products, 
        page, 
        pages: Math.ceil(documentsCount / documentsPerPage),
        reqUser: req.user
      });
    } else {
      next(customError('Product not found', 404))
    }
};

const getProductById = async(req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (product) { 
    return res.json(product);
  } else { 
    next(customError('Resource not found', 404))
  }
};

const deleteProductById = async (req, res, next) => {
  const productDeleted = await Product.findByIdAndDelete(req.params.id);
  if (productDeleted) { 
    return res.json(productDeleted);
  } else { 
    next(customError('Resource not found for delete', 404))
  }
}

const createProduct = async(req, res, next) => {
  const product = new Product({
    name: 'Sample Product',
    price: 0, 
    user: req.user._id,
    image: '/images/sample.pnj',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0, 
    numReviewes: 0, 
    description: 'Sample description'
  });
  
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

const updateProduct = async (req, res, next ) => { 
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  
  if (product) { 
    product.name = name; 
    product.price = price; 
    product.description = description; 
    product.image = 'http://localhost:8000' + image; 
    product.brand = brand; 
    product.category = category;
    product.countInStock= countInStock; 
    const productUpdate = await product.save();
    res.status(200).json(productUpdate);
  } else { 
    next(customError('Resource not found', 404))
  }

} 

const createProductReview = async (req, res, next) => {
  const { rating, comment } = req.body; 
  const product = await Product.findById(req.params.id);
  if (product) { 
    const alreadyReviews = product.reviews.find((review) => 
      review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviews) { 
      return next(customError('Product already reviewed', 400));
    }
    const review = { 
      name: req.user.name, 
      rating: Number(rating), 
      comment, 
      user: req.user._id,
    }
    product.reviews.push(review);
    product.numReviewes = product.reviews.length;
    product.rating = 
      product.reviews.reduce((acc, review) => 
        acc + review.rating, 0) / product.reviews.length;
    await product.save();
    return res.status(201).json({message: 'Review added'});
  } else { 
    next(customError('Product cannot found for review', 404))
  }
};

const getTopProducts = async (req, res, next) => { 
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
};

export { 
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct, 
  deleteProductById,
  createProductReview, 
  getTopProducts,
}