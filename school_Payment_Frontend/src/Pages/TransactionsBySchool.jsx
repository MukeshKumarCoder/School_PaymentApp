import React, { useState, useEffect } from "react";
import API from "../api";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const TransactionsBySchool = () => {
  const [schoolId, setSchoolId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.warn("Please login to continue");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleFetch = async () => {
    if (!schoolId) {
      toast.warn("Please enter a School ID");
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(`/payment/school/${schoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.transactions.length === 0) {
        toast.info("No transactions found for this School ID");
      } else {
        toast.success("Transactions loaded successfully");
      }

      setData(res.data.transactions);
      setSchoolId("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.8rem)] flex flex-col items-center pt-12 px-4 bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Transactions By School
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-md">
        <input
          type="text"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          placeholder="Enter School ID"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </div>

      {/* Grid Layout for Transactions */}
      {loading ? (
        <p className="mt-6 text-gray-600">Loading transactions...</p>
      ) : data && data.length > 0 ? (
        <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((transaction, i) => {
            const status = transaction.status?.toLowerCase();
            return (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-5 transition-transform duration-200 hover:scale-[1.02]"
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                  Transaction {i + 1}
                </h2>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>
                    <span className="font-medium">Collect ID:</span>{" "}
                    {transaction.collect_id}
                  </p>
                  <p>
                    <span className="font-medium">Custom Order ID:</span>{" "}
                    {transaction.custom_order_id}
                  </p>
                  <p>
                    <span className="font-medium">Order Amount:</span>{" "}
                    {transaction.order_amount}
                  </p>
                  <p>
                    <span className="font-medium">Transaction Amount:</span>{" "}
                    {transaction.transaction_amount}
                  </p>
                  <p>
                    <span className="font-medium">Gateway:</span>{" "}
                    {transaction.gateway}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`font-semibold ${
                        status === "success"
                          ? "text-green-600"
                          : status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.status || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <p className="mt-6 text-gray-500 italic">
            No transactions found for this school.
          </p>
        )
      )}
    </div>
  );
};

export default TransactionsBySchool;
