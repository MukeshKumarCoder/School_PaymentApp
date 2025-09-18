const mongoose = require("mongoose");

const webhookLogSchema = new mongoose.Schema({
  payload: Object,
  received_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WebhookLog", webhookLogSchema);
