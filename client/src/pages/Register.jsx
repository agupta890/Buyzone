import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import AuthLayout from "../components/auth/AuthLayout";
import GoogleIcon from "../components/auth/GoogleIcon";

const API_URL = import.meta.env.VITE_API_URL;

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { googleLogin, isGoogleLoading } = useGoogleAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome to the community! Registration successful.");
        navigate('/login');
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h2>
        <p className="text-slate-500 font-medium mt-2">
          Start your premium shopping journey in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              placeholder="Create password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              placeholder="Repeat password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-amber-500 transition-all shadow-xl hover:shadow-amber-500/20 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
        >
          {isSubmitting ? "Creating account..." : "Join BuyZone"}
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </form>

      {/* Social Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
          <span className="px-4 bg-white text-slate-400">Or sign up with</span>
        </div>
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={() => googleLogin()}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-2xl py-3.5 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <GoogleIcon className="w-5 h-5" />
        {isGoogleLoading ? "Connecting..." : "Continue with Google"}
      </button>

      <p className="mt-8 text-center text-slate-500 font-medium text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-amber-600 font-black hover:text-amber-700 transition-colors underline underline-offset-4 decoration-2 decoration-amber-500/30"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};
