const Logs = require("../models/logsModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErros");

// Create new Log
exports.newLog = catchAsyncErrors(async (req, res, next) => {
  const { date, action, details } = req.body;

  const data = await Logs.create({
    date,
    action,
    details,
  });

  res.status(201).json({
    success: true,
    data,
  });
});

exports.getAllLogs = catchAsyncErrors(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  let logs = [];

  if (startDate && endDate) {
    logs = await Logs.find({
      $and: [
        {
          date: {
            $gte: new Date(`${startDate}T00:00:00.000Z`),
            $lte: new Date(`${endDate}T00:00:00.000Z`),
          },
        },
        {
          action: {
            $ne: "PAYMENT_COLLECTED",
          },
        },
      ],
    });
  } else {
    logs = await Logs.find();
  }

  const paymentLogs = await Logs.find({ action: "PAYMENT_COLLECTED" });

  res.status(201).json({
    success: true,
    logs,
    paymentLogs,
  });
});
