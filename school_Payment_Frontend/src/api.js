import axios from "axios";

const API = axios.create({
  baseURL: "https://school-paymentapp-backend.onrender.com",
});

export default API;

// export const fetchTransactions = async ({
//   page,
//   limit,
//   sort,
//   order,
//   status,
// }) => {
//   try {
//     const res = await axios.get("/api/transactions", {
//       params: { page, limit, sort, order, status },
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     throw error;
//   }
// };

// export const fetchTransactionsBySchool = (schoolId) =>
//   API.get(`/payment/school/${schoolId}`);

// export const checkTransactionStatus = (id) => API.get(`/payment/status/${id}`);
