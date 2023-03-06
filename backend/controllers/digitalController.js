const Digital = require("../models/digitalOrderModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErros");

// Create new Order
exports.newDigitalOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    date,
    name,
    phoneNo,
    particulars,
    totalAmount,
    totalInternalAmount,
    action,
  } = req.body;

  const data = await Digital.create({
    date,
    name,
    phoneNo,
    particulars,
    totalAmount,
    totalInternalAmount,
    action,
  });

  res.status(201).json({
    success: true,
    data,
  });
});

// Get Single Digital Order
exports.getSingleDigitalOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Digital.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorHandler(`Order not Found with this ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get all Digital Orders -- Admin
exports.getAllDigitalOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Digital.find();

  res.status(200).json({
    success: true,
    orders,
  });
});

// Update Digital Order
exports.updateDigitalOrder = catchAsyncErrors(async (req, res, next) => {
  let order = await Digital.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Digital Order not found", 404));
  }

  order = await Digital.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// delete Digital Order -- Admin
exports.deleteDigitalOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Digital.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler(" Digital Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
