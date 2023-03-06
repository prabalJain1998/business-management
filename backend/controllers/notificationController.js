const Notification = require("../models/notificationModel");
const catchAsyncErrors = require("../middleware/catchAsyncErros");
const ErrorHandler = require("../utils/errorhandler");

// Create new Notification
exports.newNotification = catchAsyncErrors(async (req, res, next) => {
  const { dateCreated, message, action, updatedBy, link } = req.body;

  const data = await Notification.create({
    dateCreated,
    message,
    action,
    updatedBy,
    link,
  });

  res.status(201).json({
    success: true,
    data,
  });
});

// get all notifications
exports.getAllNotifications = catchAsyncErrors(async (req, res, next) => {
  const orders = await Notification.find();
  orders.reverse();
  res.status(200).json({
    success: true,
    orders,
  });
});

// delete Notifications
exports.deleteNotification = catchAsyncErrors(async (req, res, next) => {
  const order = await Notification.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    id: req.params.id,
  });
});
