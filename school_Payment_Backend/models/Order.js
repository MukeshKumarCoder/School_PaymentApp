const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  school_id: {
    type: String,
  },
  trustee_id: {
    type: String,
  },
  student_info: {
    name: String,
    id: String,
    email: String,
  },
  gateway_name: {
    type: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);
