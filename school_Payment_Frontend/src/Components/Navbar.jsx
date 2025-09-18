import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useDispatch, useSelector } from "react-redux";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Logout Successful!");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      dispatch(logout());
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <header className="w-full shadow-md bg-blue-600 text-gray-50">
      <nav className="w-11/12 max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-lg md:text-xl">
          EDVIRON
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/transaction"
            className="hover:text-gray-200 transition duration-200"
          >
            Transactions
          </Link>
          <Link
            to="/school"
            className="hover:text-gray-200 transition duration-200"
          >
            By School
          </Link>
          <Link
            to="/status"
            className="hover:text-gray-200 transition duration-200"
          >
            Check Status
          </Link>
          <Link
            to="/create-payment"
            className="hover:text-gray-200 transition duration-200"
          >
            Create Payment
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="border border-white bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="border border-white bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 text-gray-50 px-4 py-4 space-y-3 shadow-md">
          <Link
            to="/transaction"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-200 transition duration-200"
          >
            Transactions
          </Link>
          <Link
            to="/school"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-200 transition duration-200"
          >
            By School
          </Link>
          <Link
            to="/status"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-200 transition duration-200"
          >
            Check Status
          </Link>
          <Link
            to="/create-payment"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-200 transition duration-200"
          >
            Create Payment
          </Link>
          {token ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full border border-white bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block border border-white bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
