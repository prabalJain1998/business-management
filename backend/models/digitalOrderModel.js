const mongoose = require("mongoose");

const digitalOrderSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please Enter name"],
    maxLength: [200, "Name cannot exceed 200 characters"],
    minLength: [1, "Name should have more than 4 characters"],
  },
  phoneNo: {
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
      digitalProduct: {
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
      internalTotal: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  totalInternalAmount: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    default: "DIGITAL",
  },
});

module.exports = mongoose.model("DigitalSchema", digitalOrderSchema);
