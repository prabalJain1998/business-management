const Trash = require("../models/trashModel");
const Customer = require("../models/customerModel");
const catchAsyncErrors = require("../middleware/catchAsyncErros");
const ErrorHandler = require("../utils/errorhandler");

// Create new Order
exports.newTrashOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    phoneNo,
    whatsappNo,
    particulars,
    deliveryDate,
    totalAmount,
    paidAmount,
    orderDate,
    paymentStatus,
    paymentMode,
    orderStatus,
    partyName,
    discountAmount,
    remainingAmount,
    partyID,
    id,
  } = req.body;

  const order = await Customer.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  const data = await Trash.create({
    name,
    phoneNo,
    whatsappNo,
    particulars,
    deliveryDate,
    orderDate,
    totalAmount,
    paidAmount,
    discountAmount,
    remainingAmount,
    paymentStatus,
    paymentMode,
    orderStatus,
    partyName,
    partyID,
  });

  res.status(201).json({
    success: true,
    data,
  });
});

// get all Trash Orders -- Admin
exports.getAllTrashOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Trash.find();

  res.status(200).json({
    success: true,
    orders,
  });
});

// delete Trashs Order -- Admin
exports.deleteTrashOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Trash.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
