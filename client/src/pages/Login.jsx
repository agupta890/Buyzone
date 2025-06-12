import React, { useState } from 'react';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("login successful!");
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gray-50 px-4 py-4 sm:py-8 ">
      <div className="max-w-md w-full bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-5">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your buyzone email"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your buyzone password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-3">
          Don't have an account?
          <a href="/register" className="text-yellow-500 hover:underline ml-1">Register</a>
        </p>
      </div>
    </div>
  );
};

