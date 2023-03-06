const Customer = require("../models/customerModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErros");

const AVAILABLE = "AVAILABLE";
const PAYMENT = "PAYMENT";
const COMPLETED = "COMPLETED";
const DELETED = "DELETED";

// Create new Order
exports.newCustomerOrder = catchAsyncErrors(async (req, res, next) => {
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
  } = req.body;

  const data = await Customer.create({
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

// Get Single Order
exports.getSingleCustomer = catchAsyncErrors(async (req, res, next) => {
  const order = await Customer.findById(req.params.id);
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

// Get All Orders by Party ID
exports.getAllOrdersByPartyID = catchAsyncErrors(async (req, res, next) => {
  var query = { partyID: { $regex: req.params.partyID, $options: "i" } };
  const order = await Customer.find(query);
  if (!order) {
    return next(new ErrorHandler(`Order not Found`, 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  let orders = [];
  if (startDate && endDate) {
    orders = await Customer.find({
      orderDate: {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T00:00:00.000Z`),
      },
    });
  } else {
    orders = await Customer.find();
  }

  const allOrders = [];
  const pendingOrders = [];
  const pendingPaymentOrders = [];
  const userPendingPaymentOrders = [];
  const paymentOrders = [];
  const deletedOrders = [];
  // Insights

  // Orders
  let totalOrder = 0;
  let totalPendingOrders = 0;

  let totalAmount = 0;
  let totalPaid = 0;
  let totalDiscount = 0;
  let totalRemain = 0;

  let totalCash = 0;
  let totalOnline = 0;
  let totalBank = 0;

  // User Insights
  let totalAmountUser = 0;
  let totalPaidUser = 0;
  let totalDiscountUser = 0;

  // Party Insights
  let totalAmountParty = 0;
  let totalPaidParty = 0;
  let totalDiscountParty = 0;

  orders.forEach((order) => {
    if (order.status !== AVAILABLE) {
      deletedOrders.push(order);
    }

    if (order.status === AVAILABLE) {
      if (order.paymentMode.toLowerCase().includes("cash")) {
        totalCash += order.paidAmount;
      }
      if (order.paymentMode.toLowerCase().includes("online")) {
        totalOnline += order.paidAmount;
      }
      if (order.paymentMode.toLowerCase().includes("bank")) {
        totalBank += order.paidAmount;
      }
    }

    if (order.status === AVAILABLE) {
      if (order.partyName === "USER") {
        totalAmountUser += order.totalAmount;
        totalPaidUser += order.paidAmount;
        totalDiscountUser += order.discountAmount;
      }
      if (order.partyName !== "USER") {
        totalAmountParty += order.totalAmount;
        totalPaidParty += order.paidAmount;
        totalDiscountParty += order.discountAmount;
      }
    }

    if (order.status === AVAILABLE && order.orderStatus !== PAYMENT) {
      totalOrder += 1;
      totalAmount += order.totalAmount;
      totalPaid += order.paidAmount;
      totalDiscount += order.discountAmount;
      totalRemain += order.remainingAmount;

      if (order.orderStatus !== COMPLETED) {
        pendingOrders.push(order);
        totalPendingOrders += 1;
      }
      if (order.remainingAmount !== 0) {
        pendingPaymentOrders.push(order);
      }
      if (order.partyName === "USER" && order.remainingAmount !== 0) {
        userPendingPaymentOrders.push(order);
      }
      allOrders.push(order);
    }
    if (order.status === AVAILABLE && order.orderStatus === PAYMENT) {
      paymentOrders.push(order);
    }
  });

  const insights = {
    orders: {
      totalOrder,
      totalPendingOrders,
      orderPercentage: (
        ((totalOrder - totalPendingOrders) / totalOrder) *
        100
      ).toFixed(2),
    },
    amount: {
      totalAmount,
      totalPaid,
      totalDiscount,
      totalRemain,
      amountPercentage: (
        (totalPaid / (totalAmount - totalDiscount)) *
        100
      ).toFixed(2),
    },
    money: {
      totalCash,
      totalOnline,
      totalBank,
    },
    user: {
      totalAmountUser,
      totalPaidUser,
      totalDiscountUser,
      userPercentage: (
        (totalPaidUser / (totalAmountUser - totalDiscountUser)) *
        100
      ).toFixed(2),
    },
    party: {
      totalAmountParty,
      totalPaidParty,
      totalDiscountParty,
      partyPercentage: (
        (totalPaidParty / (totalAmountParty - totalDiscountParty)) *
        100
      ).toFixed(2),
    },
  };

  res.status(200).json({
    success: true,
    pendingOrders,
    pendingPaymentOrders,
    userPendingPaymentOrders,
    paymentOrders,
    orders: allOrders.reverse(),
    deletedOrders,
    insights,
  });
});

// Get Single Order
exports.getSingleCustomer = catchAsyncErrors(async (req, res, next) => {
  const order = await Customer.findById(req.params.id);
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

// Get All Orders by Party ID
exports.getAllOrdersByPartyID = catchAsyncErrors(async (req, res, next) => {
  var query = { partyID: { $regex: req.params.partyID, $options: "i" } };
  const order = await Customer.find(query);
  if (!order) {
    return next(new ErrorHandler(`Order not Found`, 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get Pending Orders -- Admin
exports.getPendingOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Customer.find({
    orderStatus: { $not: { $eq: "COMPLETED" } },
  });
  const pendingOrders = [];
  orders.forEach((order) => {
    if (order.status === AVAILABLE && order.orderStatus !== PAYMENT) {
      pendingOrders.push(order);
    }
  });

  res.status(200).json({
    success: true,
    pendingOrders,
  });
});

// get Pending Payment Orders -- Admin
exports.getPendingPaymentOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Customer.find({ remainingAmount: { $not: { $eq: 0 } } });
  const pendingPaymentOrders = [];
  orders.forEach((order) => {
    if (order.status === AVAILABLE && order.orderStatus !== PAYMENT) {
      pendingPaymentOrders.push(order);
    }
  });

  res.status(200).json({
    success: true,
    pendingPaymentOrders,
  });
});

// get User Pending Payment Orders -- Admin
exports.getuserPendingPaymentOrders = catchAsyncErrors(
  async (req, res, next) => {
    const orders = await Customer.find({
      remainingAmount: { $not: { $eq: 0 } },
    });
    const userPendingPaymentOrders = [];
    orders.forEach((order) => {
      if (
        order.status === AVAILABLE &&
        order.orderStatus !== PAYMENT &&
        order.partyName === "USER"
      ) {
        userPendingPaymentOrders.push(order);
      }
    });

    res.status(200).json({
      success: true,
      userPendingPaymentOrders,
    });
  }
);

// get Insights -- Admin
exports.getInsights = catchAsyncErrors(async (req, res, next) => {
  const orders = await Customer.find();

  // Insights

  // Orders
  let totalOrder = 0;
  let totalPendingOrders = 0;

  // Amount
  let totalAmount = 0;
  let totalPaid = 0;
  let totalDiscount = 0;
  let totalRemain = 0;

  // Money
  let totalCash = 0;
  let totalOnline = 0;
  let totalBank = 0;

  // User Insights
  let totalAmountUser = 0;
  let totalPaidUser = 0;
  let totalDiscountUser = 0;

  // Party Insights
  let totalAmountParty = 0;
  let totalPaidParty = 0;
  let totalDiscountParty = 0;

  orders.forEach((order) => {
    if (order.status === AVAILABLE) {
      if (order.paymentMode.toLowerCase().includes("cash")) {
        totalCash += order.paidAmount;
      }
      if (order.paymentMode.toLowerCase().includes("online")) {
        totalOnline += order.paidAmount;
      }
      if (order.paymentMode.toLowerCase().includes("bank")) {
        totalBank += order.paidAmount;
      }
    }

    if (order.status === AVAILABLE) {
      if (order.partyName === "USER") {
        totalAmountUser += order.totalAmount;
        totalPaidUser += order.paidAmount;
        totalDiscountUser += order.discountAmount;
      }
      if (order.partyName !== "USER") {
        totalAmountParty += order.totalAmount;
        totalPaidParty += order.paidAmount;
        totalDiscountParty += order.discountAmount;
      }
    }

    if (order.status === AVAILABLE && order.orderStatus !== PAYMENT) {
      totalOrder += 1;
      totalAmount += order.totalAmount;
      totalPaid += order.paidAmount;
      totalDiscount += order.discountAmount;
      totalRemain += order.remainingAmount;

      if (order.orderStatus !== COMPLETED) {
        totalPendingOrders += 1;
      }
    }

    if (order.status === AVAILABLE && order.orderStatus === PAYMENT) {
      totalPaid += order.paidAmount;
    }
  });

  const insights = {
    orders: {
      totalOrder,
      totalPendingOrders,
      orderPercentage: (
        ((totalOrder - totalPendingOrders) / totalOrder) *
        100
      ).toFixed(2),
    },
    amount: {
      totalAmount,
      totalPaid,
      totalDiscount,
      totalRemain,
      amountPercentage: (
        (totalPaid / (totalAmount - totalDiscount)) *
        100
      ).toFixed(2),
    },
    money: {
      totalCash,
      totalOnline,
      totalBank,
    },
    user: {
      totalAmountUser,
      totalPaidUser,
      totalDiscountUser,
      userPercentage: (
        (totalPaidUser / (totalAmountUser - totalDiscountUser)) *
        100
      ).toFixed(2),
    },
    party: {
      totalAmountParty,
      totalPaidParty,
      totalDiscountParty,
      partyPercentage: (
        (totalPaidParty / (totalAmountParty - totalDiscountParty)) *
        100
      ).toFixed(2),
    },
  };

  res.status(200).json({
    success: true,
    insights,
  });
});

// Get Single Order by Name
exports.getSingleCustomerByName = catchAsyncErrors(async (req, res, next) => {
  var query = { name: { $regex: req.params.name, $options: "i" } };
  const order = await Customer.find(query);
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

// Get Single Order by Party
exports.getSingleCustomerByParty = catchAsyncErrors(async (req, res, next) => {
  var query = { partyName: { $regex: req.params.partyName, $options: "i" } };
  const order = await Customer.find(query);
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

// Update Customer
exports.updateCustomer = catchAsyncErrors(async (req, res, next) => {
  let order = await Customer.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Product not found", 404));
  }

  order = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// Update Customer Status
exports.updateCustomerStatus = catchAsyncErrors(async (req, res, next) => {
  let order = await Customer.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Product not found", 404));
  }

  order = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// delete Customer -- Admin
exports.deleteCustomer = catchAsyncErrors(async (req, res, next) => {
  const order = await Customer.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
