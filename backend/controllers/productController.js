import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@desc     Fetch all products
//@route    GET/api/products
//@access   Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
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

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
