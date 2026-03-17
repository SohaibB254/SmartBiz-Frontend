import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Toast from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import API_HOST from "../../config";

const LoginForm = () => {
  const navigate = useNavigate();

  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    success: false,
    message: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_HOST}/auth/login`,
        formData,
      );

      // Success path
      setToastConfig({
        isVisible: true,
        success: true,
        message: response.data.message || "Login successful!",
      });

      localStorage.setItem("user", JSON.stringify(response.data.userData));

      // Redirect based on role
      if (response.data.userData.role === "customer") {
        navigate("/marketplace");
      } else {
        navigate("/seller/overview");
      }
    } catch (error) {
      console.error("Login error:", error);

      // ERROR PATH: Extract the message sent by your backend
      // If the backend didn't send a message, fall back to a generic one
      const errorMessage =
        error.response?.data?.message || "Invalid email or password.";

      // Trigger the Toast to show the error
      setToastConfig({
        isVisible: true,
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeToast = () => {
    setToastConfig((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      {toastConfig.isVisible && (
        <Toast
          success={toastConfig.success}
          message={toastConfig.message}
          onClose={closeToast}
        />
      )}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
        <h1 className="text-4xl font-bold mb-8 text-black">
          Welcome back to <span className="text-[#e29525]">SmartBiz</span>
        </h1>

        <div className="bg-white rounded-4xl shadow-sm border border-gray-200 overflow-hidden w-full max-w-100">
          <div className="bg-[#e29525] py-6 px-8 rounded-t-4xl">
            <h2 className="text-white text-2xl font-medium">
              Login to SmartBiz account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-5">
              <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
                <Mail className="w-4 h-4" strokeWidth={2.5} />
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e29525] focus:border-transparent text-sm placeholder-gray-400"
              />
            </div>

            <div className="mb-8">
              <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
                <Lock className="w-4 h-4" strokeWidth={2.5} />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="**********"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e29525] focus:border-transparent text-sm placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-4 rounded-3xl transition duration-200 flex justify-center items-center disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="mt-8 text-center text-sm text-gray-800">
              Don't have an account?{" "}
              <a href="/sign-up" className="text-blue-600 hover:underline">
                Create one here
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
