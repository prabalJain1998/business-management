const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErros");

// Create new Product
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, price } = req.body;

  const data = await Product.create({ name, price });

  res.status(201).json({
    success: true,
    data,
  });
});

// Get Single Product
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const party = await Product.findById(req.params.id);

  if (!party) {
    return next(
      new ErrorHandler(`Product not Found with this ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    party,
  });
});

// get all Products -- Admin
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Update Product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
