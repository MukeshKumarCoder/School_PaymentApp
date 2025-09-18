import React, { useState, useEffect } from "react";
import API from "../api";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CheckStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.warn("Please login to continue");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleCheck = async () => {
    if (!orderId) {
      toast.warning("Please enter an Order ID");
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(`/payment/status/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(res.data.transaction);
      toast.success("Transaction status fetched successfully");
      setOrderId("");
    } catch (error) {
      console.error(error);
      setStatus(null);
      toast.error("Failed to fetch transaction status");
      setOrderId("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.8rem)] flex flex-col items-center pt-12 px-4 bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Check Transaction Status
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-md">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {status && (
        <div className="mt-6 w-full max-w-md bg-white rounded-2xl shadow-lg p-5 transition-transform duration-200 hover:scale-[1.02]">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Transaction Details
          </h2>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>
              <span className="font-medium">Collect ID:</span>{" "}
              {status.collect_id}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`font-semibold ${
                  status.status === "success"
                    ? "text-green-600"
                    : status.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {status.status}
              </span>
            </p>
            <p>
              <span className="font-medium">Order Amount:</span>{" "}
              {status.order_amount}
            </p>
            <p>
              <span className="font-medium">Transaction Amount:</span>{" "}
              {status.transaction_amount}
            </p>
            <p>
              <span className="font-medium">Gateway:</span> {status.gateway}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckStatus;
