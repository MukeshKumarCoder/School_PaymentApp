const router = require("express").Router();
const {
  createPayment,
  getTransactions,
  getTransactionsBySchoolId,
  getTransactionsByCustomId,
} = require("../controllers/Payment");

const { auth } = require("../middleware/auth");

router.post("/create-payment", auth, createPayment);
router.get("/transactions", auth, getTransactions);
router.get("/school/:schoolId", auth, getTransactionsBySchoolId);
router.get("/status/:custom_order_id", auth, getTransactionsByCustomId);

module.exports = router;

// "status": 200,
// "order_info": {
// "order_id": "68c9a1f3fc8da260cddc2c18",
// "order_amount": 2000,
// "transaction_amount": 2200,
// "gateway": "PhonePe",
// "bank_reference": "YESBNK222",
// "status": "success",
// "payment_mode": "upi",
// "payment_details": "success@ybl",
// "Payment_message": "payment success",
// "payment_time": "2025-04-23T08:14:21.945+00:00",
// "error_message": "NA"
// }


