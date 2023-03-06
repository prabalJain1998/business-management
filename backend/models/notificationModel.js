const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  message: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
