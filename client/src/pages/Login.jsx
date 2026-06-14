import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import AuthLayout from "../components/auth/AuthLayout";
import GoogleIcon from "../components/auth/GoogleIcon";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { googleLogin, isGoogleLoading } = useGoogleAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        login(data.user);
        toast.success("Welcome back to BuyZone!");

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-slate-500 font-medium mt-2">
          Sign in to continue to your BuyZone account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="flex items-center justify-between ml-1">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <Link to="/forgot-password" className="text-xs font-bold text-amber-600 hover:text-amber-700">
              Forgot?
            </Link>
          </div>
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
              placeholder="••••••••"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-amber-500 transition-all shadow-xl hover:shadow-amber-500/20 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </form>

      {/* Social Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
          <span className="px-4 bg-white text-slate-400">Or continue with</span>
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
        New to BuyZone?{" "}
        <Link
          to="/register"
          className="text-amber-600 font-black hover:text-amber-700 transition-colors underline underline-offset-4 decoration-2 decoration-amber-500/30"
        >
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
};
