import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import TransactionsOverview from "./Pages/TransactionsOverview";
import TransactionsBySchool from "./Pages/TransactionsBySchool";
import CheckStatus from "./Pages/CheckStatus";
import Login from "./Pages/Login";
import CreatePayment from "./Pages/CreatePayment";
import Home from "./Pages/Home";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transaction" element={<TransactionsOverview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/school" element={<TransactionsBySchool />} />
        <Route path="/status" element={<CheckStatus />} />
        <Route path="/create-payment" element={<CreatePayment />} />
      </Routes>
    </>
  );
}

export default App;
