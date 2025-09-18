import React, { useState, useEffect } from "react";
import API from "../api";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreatePayment = () => {
  const [orderAmount, setOrderAmount] = useState("");
  const [gatewayName, setGatewayName] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) {
      toast.warn("Please login to continue");
      navigate("/login");
    }
  }, [token, user, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post(
        "/payment/create-payment",
        {
          order_amount: orderAmount,
          student_info: {
            name: user.userName,
            email: user.email,
            id: user._id,
          },
          gateway_name: gatewayName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Redirecting to payment...");
        setTimeout(() => (window.location.href = "/transaction"), 1200);
      } else {
        toast.error(res.data.message || "Payment failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.8rem)] flex justify-center items-start pt-12 px-4 bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Create Payment
        </h2>
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Amount
            </label>
            <input
              type="number"
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gateway Name
            </label>
            <select
              value={gatewayName}
              onChange={(e) => setGatewayName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Gateway</option>
              <option value="razorpay">Razorpay</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePayment;
