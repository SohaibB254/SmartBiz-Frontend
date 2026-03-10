import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_HOST = 'http://localhost:3000';

const SignUpForm = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({})

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
      const response = await axios.post(`${API_HOST}/auth/sign-up`, formData);
      setStatusMessage(response?.data?.message);
      setSuccess(response.data.success)
      setData(response.data)
      localStorage.setItem('user', JSON.stringify(response.data.userData));
      // You can redirect or clear the form here
      if(response.data.userData.role == 'customer'){
          navigate('/marketplace')
        }else{
          navigate('/seller/overview')
        }
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      {/* Main Title */}
      <h1 className="text-4xl font-bold mb-8 text-black">
        Welcome to <span className="text-[#e29525]">SmartBiz</span>
      </h1>

      {/* Form Card */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-200 overflow-hidden w-full max-w-100">

        {/* Card Header */}
        <div className="bg-[#e29525] py-6 px-8 text-center rounded-t-4xl">
          <h2 className="text-white text-2xl font-medium">
            Join SmartBiz for free now!
          </h2>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8">

          {/* Username Field */}
          <div className="mb-5">
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-2">
              <User className="w-4 h-4" strokeWidth={2.5} />
              <span>Username</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Sara Jones"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e29525] focus:border-transparent text-sm placeholder-gray-400"
            />
          </div>

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
            {isLoading ? 'Creating...' : 'Create account'}
          </button>

          {/* Status Message */}
          {statusMessage && (
            <p className={`mt-4 text-center text-sm ${data.success ? 'text-green-600' : 'text-red-600'}`}>
              {statusMessage}
            </p>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-gray-800">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;