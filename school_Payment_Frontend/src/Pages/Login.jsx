import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    userName: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = currentState === "Login" ? "/auth/login" : "/auth/signup";
    try {
      const res = await API.post(url, userData);

      if (currentState === "Login") {
        const userData = res.data.user;
        const token = res.data.token;

        dispatch(login({ user: userData, token }));
        toast.success("Login Successfully");
        setUserData({
          email: "",
          password: "",
          userName: "",
        });
        navigate("/");
      } else {
        toast.success("Registration Successful ! Please Login");
        setUserData({
          email: "",
          password: "",
          userName: "",
        });
        setCurrentState("Login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. please Try again");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full mt-15">
      <div className="flex flex-col items-center justify-center w-1/3 bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{currentState}</h1>
        <div>
          {currentState === "Login" ? (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                required
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full p-2 border border-gray-300 outline-none rounded mb-4"
              />
              <input
                type="password"
                placeholder="Password"
                value={userData.password}
                required
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                className="w-full p-2 border border-gray-300 outline-none rounded mb-4"
              />
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 cursor-pointer text-white rounded"
              >
                Login
              </button>
              <p className="mt-4 text-sm text-gray-500">
                Don't have an account?{" "}
                <span
                  onClick={() => setCurrentState("Sign Up")}
                  className="text-blue-600 cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={userData.userName}
                required
                onChange={(e) =>
                  setUserData({ ...userData, userName: e.target.value })
                }
                className="w-full p-2 border border-gray-300 outline-none rounded mb-4"
              />
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                required
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full p-2 border border-gray-300 outline-none rounded mb-4"
              />
              <input
                type="password"
                placeholder="Password"
                value={userData.password}
                required
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                className="w-full p-2 border border-gray-300 outline-none rounded mb-4"
              />
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 cursor-pointer text-white rounded"
              >
                Sign Up
              </button>
              <p className="mt-4 text-sm text-gray-500">
                Already have an account?{" "}
                <span
                  onClick={() => setCurrentState("Login")}
                  className="text-blue-600 cursor-pointer"
                >
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
