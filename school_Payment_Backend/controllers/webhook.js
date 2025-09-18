const OrderStatus = require("../models/OrderStatus");
const WebhookLog = require("../models/WebhookLog");

exports.webhookStatus = async (req, res) => {
  try {
    const { order_info } = req.body;

    if (!order_info) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: order_info with order_id is required",
      });
    }

    await WebhookLog.create({ payload: req.body });

    // Update order status
    const updatedOrder = await OrderStatus.findOneAndUpdate(
      { collect_id: order_info.order_id },
      {
        transaction_amount: order_info.transaction_amount,
        payment_mode: order_info.payment_mode,
        payment_details: order_info.payment_details,
        bank_reference: order_info.bank_reference,
        payment_message: order_info.payment_message,
        status: order_info.status,
        error_message: order_info.error_message,
        payment_time: order_info.payment_time,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found for the provided order_id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process webhook",
      error: error.message,
    });
  }
};
