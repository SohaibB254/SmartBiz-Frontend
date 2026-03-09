import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Toast from '../../components/common/Toast';
import {  useNavigate } from 'react-router-dom';


const LoginForm = () => {
   // UseLocation hook for redirecting
const navigate = useNavigate()
  // Set up state to hold the toast configuration
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    success: false,
    message: ''
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('');

    try {
      // Pointing to a login endpoint
      const response = await axios.post('http://localhost:3000/auth/login', formData);
      setStatusMessage(response?.data?.message);
      setToastConfig({
        isVisible: true,
        success: response.data.success,
        message: response.data.message
      });
      localStorage.setItem('user', JSON.stringify(response.data.userData));
      //  Redirecting to marketplace
      if (response.data.success)
        if(response.data.userData.role == 'customer'){
          navigate('/marketplace')
        }else{
          navigate('/seller/dashboard/overview')
        }
    } catch (error) {
      console.error('Login error:', error);
      setStatusMessage(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);

    }
  };
  const closeToast = () => {
  setToastConfig(prev => ({ ...prev, isVisible: false }));
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
      {/* Main Title */}
      <h1 className="text-4xl font-bold mb-8 text-black">
        Welcome back to <span className="text-[#e29525]">SmartBiz</span>
      </h1>

      {/* Form Card */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-200 overflow-hidden w-full max-w-100">

        {/* Card Header */}
        <div className="bg-[#e29525] py-6 px-8 rounded-t-4xl">
          <h2 className="text-white text-2xl font-medium">
            Login to SmartBiz account
          </h2>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8">

          {/* Email Field */}
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

          {/* Password Field */}
          <div className="mb-8">
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
              <Lock className="w-4 h-4" strokeWidth={2.5} />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-4 rounded-3xl transition duration-200 flex justify-center items-center"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm text-gray-800">
            Don't have an account?{' '}
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