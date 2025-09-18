import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4.8rem)] flex flex-col items-center pt-12 px-4 bg-gray-100 text-center">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Welcome to School Payment App
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Manage school fee payments securely and seamlessly using Razorpay,
          Stripe, or PayPal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/create-payment"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            Make a Payment
          </Link>
          <Link
            to="/transaction"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-300 transition"
          >
            View Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
