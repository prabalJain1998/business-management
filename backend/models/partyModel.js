const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Party's name"],
  },
  phoneNo: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
    required: true,
  },
  details: {
    type: String,
  },
  address: {
    type: String,
  },
});

module.exports = mongoose.model("Party", partySchema);
