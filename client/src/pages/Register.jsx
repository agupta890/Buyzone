import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { VITE_API_URL } from "../config";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful!");
        navigate('/login');
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-300 px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Create your password"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 cursor-pointer text-white py-2.5 rounded-lg font-bold shadow-md transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?
          <Link to="/login" className="text-pink-500 hover:underline font-semibold ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
