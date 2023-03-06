const mongoose = require("mongoose");

const logsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  action: {
    type: String,
    required: [true, "Action name not provided"],
  },
  details: {
    amount: {
      type: Number,
      required: [true, "Amount not provided"],
    },
    message: {
      type: String,
      required: [true, "message not provided"],
    },
    referenceID: {
      type: String,
      required: [true, "ref ID not provided"],
    },
  },
});

module.exports = mongoose.model("Logs", logsSchema);
