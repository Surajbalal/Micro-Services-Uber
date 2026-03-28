const mongoose = require("mongoose");

const outboxSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true
  },
  payload: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "SENT", "FAILED"],
    default: "PENDING"
  },
  retryCount: {
    type: Number,
    default: 0
  },
  lastError: String,
  sentAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Outbox", outboxSchema);