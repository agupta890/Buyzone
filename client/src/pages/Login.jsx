import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
// import ReCAPTCHA from "react-google-recaptcha";

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
        credentials: "include", // 🔑 send cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // ✅ no token, just save user in context
        login(data.user);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center bg-white px-4 py-6">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center rounded-lg shadow-md">
        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Login to Buyzone
          </h2>

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

            {/* Captcha Placeholder */}
            {/* <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"
              onChange={(value) => console.log("Captcha value:", value)}
            /> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90"
            >
              Log In
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="hidden md:flex w-px bg-gray-200 mx-6"></div>
        <div className="my-4 md:hidden flex items-center">
          <span className="w-full border-b" />
          <span className="px-2 text-sm text-gray-500">or</span>
          <span className="w-full border-b" />
        </div>

        {/* Right Section - Social Login */}
        <div className="w-full md:w-1/2 p-6 flex flex-col space-y-3">
          <button className="flex items-center justify-center border rounded-lg py-2 font-medium hover:bg-gray-50">
            <img
              src="https://www.svgrepo.com/show/473731/youtube-color.svg"
              alt="YouTube"
              className="w-5 h-5 mr-2"
            />
            Continue with YouTube
          </button>
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
  );
};
