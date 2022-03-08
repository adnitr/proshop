import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@desc     Fetch all products
//@route    GET/api/products
//@access   Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber || 1);

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Fetch single products
//@route    GET/api/products/:id
//@access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found!');
  }
});

//@desc     Delete a products
//@route    DELETE /api/products/:id
//@access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed!' });
  } else {
    res.status(404);
    throw new Error('Product not found!');
  }
});

//@desc     Create a products
//@route    POST /api/products
//@access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 99.99,
    countInStock: 5,
    brand: 'Sample brand',
    category: 'Sample category',
    user: req.user._id,
    image: '/images/sample.jpg',
    numReviews: 0,
    description: 'Sample description',
  });
  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
});

//@desc     Update a products
//@route    PUT /api/products/:id
//@access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, countInStock, brand, category, image, description } =
    req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found!');
  }
  product.name = name;
  product.price = price;
  product.countInStock = countInStock;
  product.brand = brand;
  product.category = category;
  product.image = image;
  product.description = description;

  const updatedProduct = await product.save();
  res.status(201).json(updatedProduct);
});

//@desc     Create a review
//@route    POST /api/products/:id/reviews
//@access   Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found!');
  }
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed the product.');
  }
  product.reviews.push({
    rating: Number(rating),
    comment,
    name: req.user.name,
    user: req.user._id,
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, curr) => (acc += curr.rating), 0) /
    product.numReviews;
  await product.save();
  res.status(201).json({ message: 'Review added!' });
});

//@desc     Get top rated products
//@route    GET /api/products/top
//@access   Public
const getTopRatedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopRatedProducts,
};
