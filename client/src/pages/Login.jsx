import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        login(data.user);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Left Section - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://res.cloudinary.com/project01/image/upload/v1757780287/piue1mytbf2dgrqrgz8f.jpg"
            alt="Login Illustration"
            className="w-full h-full object-center"
          />
        </div>

        {/* Right Section - Login */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-6">Login to Buyzone</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <span className="flex-grow border-t border-gray-300"></span>
            <span className="px-3 text-sm text-gray-500">or</span>
            <span className="flex-grow border-t border-gray-300"></span>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col space-y-3">
            {/* <button className="flex items-center justify-center border rounded-lg py-2 font-medium hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/473731/youtube-color.svg"
                alt="YouTube"
                className="w-5 h-5 mr-2"
              />
              Continue with YouTube
            </button> */}
            <button className="flex items-center justify-center border rounded-lg py-2 font-medium hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>
            <button className="flex items-center justify-center border rounded-lg py-2 font-medium hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/448224/facebook.svg"
                alt="Facebook"
                className="w-5 h-5 mr-2"
              />
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
