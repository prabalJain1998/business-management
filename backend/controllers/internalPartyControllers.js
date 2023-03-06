const InternalParty = require("../models/internalPartyModel.js");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErros");

// Create new Party
exports.newParty = catchAsyncErrors(async (req, res, next) => {
  const { name, phoneNo, details, address } = req.body;

  const data = await InternalParty.create({ name, phoneNo, details, address });

  res.status(201).json({
    success: true,
    data,
  });
});

// get all Parties -- Admin
exports.getAllParties = catchAsyncErrors(async (req, res, next) => {
  const parties = await InternalParty.find();

  res.status(200).json({
    success: true,
    parties,
  });
});

// Get Single Party
exports.getSingleParty = catchAsyncErrors(async (req, res, next) => {
  const party = await InternalParty.findById(req.params.id);

  if (!party) {
    return next(
      new ErrorHandler(`Order not Found with this ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    party,
  });
});

// Get Party by Name
exports.getPartyByName = catchAsyncErrors(async (req, res, next) => {
  var query = { name: { $regex: req.params.name, $options: "i" } };
  const party = await InternalParty.find(query);
  if (!party) {
    return next(new ErrorHandler(`Party not Found`, 404));
  }
  res.status(200).json({
    success: true,
    party,
  });
});

// Update Party
exports.updateParty = catchAsyncErrors(async (req, res, next) => {
  let party = await InternalParty.findById(req.params.id);

  if (!party) {
    return next(new ErrorHandler("Party not found", 404));
  }

  party = await InternalParty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    party,
  });
});

// delete Party
exports.deleteParty = catchAsyncErrors(async (req, res, next) => {
  const party = await InternalParty.findById(req.params.id);

  if (!party) {
    return next(new ErrorHandler("Party not found", 404));
  }

  await InternalParty.remove();

  res.status(200).json({
    success: true,
  });
});
