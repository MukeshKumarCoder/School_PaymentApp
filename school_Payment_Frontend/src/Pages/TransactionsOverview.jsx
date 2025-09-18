import React, { useEffect, useState } from "react";
import API from "../api";
import { useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransactionsOverview = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/payment/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.transactions);
      toast.success("Transactions loaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.warn("Please login to continue");
      navigate("/login");
    } else {
      getData();
    }
  }, [token, navigate]);

  const filteredData = data.filter((item) =>
    statusFilter
      ? (item.status?.toLowerCase() || "") === statusFilter.toLowerCase()
      : true
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-[calc(100vh-4.8rem)]">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Transactions Overview
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-lg">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-600 py-6">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500 py-6 italic">
            No transactions available.
          </p>
        ) : (
          <Table className="min-w-full border-collapse">
            <Thead className="bg-blue-50">
              <Tr>
                {[
                  "Collect ID",
                  "School ID",
                  "Gateway",
                  "Order Amount",
                  "Transaction Amount",
                  "Status",
                  "Custom Order ID",
                ].map((header) => (
                  <Th
                    key={header}
                    className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((transaction, i) => {
                  const status = transaction.status?.toLowerCase();
                  return (
                    <Tr
                      key={i}
                      className="transition-all duration-200 text-center hover:bg-blue-50 cursor-pointer odd:bg-gray-50"
                    >
                      <Td className="px-4 py-3 text-sm text-gray-700">
                        {transaction.collect_id}
                      </Td>
                      <Td className="px-4 py-3 text-sm text-gray-700">
                        {transaction.school_id}
                      </Td>
                      <Td className="px-4 py-3 text-sm text-gray-700">
                        {transaction.gateway}
                      </Td>
                      <Td className="px-4 py-3 text-sm text-gray-700">
                        {transaction.order_amount}
                      </Td>
                      <Td className="px-4 py-3 text-sm text-gray-700">
                        {transaction.transaction_amount}
                      </Td>
                      <Td
                        className={`px-4 py-3 text-sm font-semibold ${
                          status === "success"
                            ? "text-green-600"
                            : status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.status || "N/A"}
                      </Td>
                      <Td className="px-4 py-3 text-sm text-gray-700">
                        {transaction.custom_order_id}
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No results found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows per page:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg transition duration-200 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border border-gray-300 rounded-lg transition duration-200 ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white hover:bg-blue-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg transition duration-200 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsOverview;
