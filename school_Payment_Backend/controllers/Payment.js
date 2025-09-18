const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");

exports.createPayment = async (req, res) => {
  try {
    const { order_amount, student_info, gateway_name } = req.body;

    if (!order_amount || !student_info || !gateway_name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create new order
    const newOrder = await Order.create({
      school_id: process.env.SCHOOL_ID,
      trustee_id: "trustee123",
      student_info,
      gateway_name,
    });

    // Simulate payment API signing
    const payload = { order_amount, collect_id: newOrder._id };
    const signed = jwt.sign(payload, process.env.PAYMENT_API_KEY);

    const fakePaymentUrl = `http://localhost:5173/payment/${newOrder._id}`;

    // Save initial status
    await OrderStatus.create({
      collect_id: newOrder._id,
      order_amount,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      redirect_url: fakePaymentUrl,
    });
  } catch (error) {
    console.error("Create Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order_details",
        },
      },
      { $unwind: "$order_details" },
      {
        $project: {
          collect_id: 1,
          school_id: "$order_details.school_id",
          gateway: "$order_details.gateway_name",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: "$order_details._id",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

exports.getTransactionsBySchoolId = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const transactions = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order_details",
        },
      },
      { $unwind: "$order_details" },
      { $match: { "order_details.school_id": schoolId } },
      {
        $project: {
          collect_id: 1,
          school_id: "$order_details.school_id",
          gateway: "$order_details.gateway_name",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: "$order_details._id",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get Transactions by SchoolId Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions by school ID",
      error: error.message,
    });
  }
};

exports.getTransactionsByCustomId = async (req, res) => {
  try {
    const { custom_order_id } = req.params;

    const transaction = await OrderStatus.findOne({
      collect_id: custom_order_id,
    }).populate("collect_id", "school_id gateway_name");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      transaction: {
        collect_id: transaction.collect_id._id,
        school_id: transaction.collect_id.school_id,
        gateway: transaction.collect_id.gateway_name,
        order_amount: transaction.order_amount,
        transaction_amount: transaction.transaction_amount,
        status: transaction.status,
        payment_time: transaction.payment_time,
        error_message: transaction.error_message,
      },
    });
  } catch (error) {
    console.error("Get Transaction by CustomId Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction by custom order ID",
      error: error.message,
    });
  }
};
