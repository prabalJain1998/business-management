const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product's name"],
  },
  price: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
