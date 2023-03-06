const mongoose = require("mongoose");

const trashSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
    maxLength: [200, "Name cannot exceed 200 characters"],
    minLength: [1, "Name should have more than 4 characters"],
  },
  phoneNo: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
  },
  whatsappNo: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
  },
  particulars: [
    {
      item: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      partyID: {
        type: String,
        required: true,
      },
    },
  ],
  deliveryDate: {
    type: Date,
    default: Date.now(),
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  partyID: {
    type: String,
    default: "USER",
  },
});

module.exports = mongoose.model("Trash", trashSchema);
