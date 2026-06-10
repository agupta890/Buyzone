import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Shield, LogOut, Package, ArrowRight } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setFormData({ name: data.name || "", email: data.email || "" });
        } else {
          toast.error("Failed to fetch user details");
          navigate("/login");
        }
      } catch {
        toast.error("Network error");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
      toast.success("Logged out successfully");
      navigate("/login?fromLogout=true");
    } catch {
      toast.error("Error logging out");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        toast.success("Profile updated");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
      </div>
    );
  }

  const initials = (user.name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const roleLabel = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User";

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-lg shadow-amber-500/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-gray-900">{user.name || "Guest"}</h2>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
              {roleLabel}
            </span>
          </div>
          <Link
            to="/orders"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Package size={15} /> My Orders
          </Link>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Edit Profile</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 ml-1">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 ml-1">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 ml-1">Role</label>
              <div className="relative">
                <Shield size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={roleLabel}
                  disabled
                  className="w-full pl-9 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-slate-900 hover:bg-amber-500 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 py-2.5 rounded-xl transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
