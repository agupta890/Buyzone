import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { VITE_API_URL } from "../../config";

const userProfileImage = "https://picsum.photos/200?random=2";
const fallbackImage = "https://picsum.photos/200?random=3";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", profilePhoto: null });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setFormData({
            name: data.username || "",
            email: data.email || "",
            profilePhoto: null,
          });
        } else {
          toast.error("Failed to fetch user details", { position: "top-center" });
          navigate("/login");
        }
      } catch (err) {
        toast.error("Error fetching user details", { position: "top-center" });
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully", { position: "top-center" });
      navigate("/login?fromLogout=true");
    } catch (err) {
      toast.error("Error logging out", { position: "top-center" });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto" && files[0]) {
      setFormData({ ...formData, profilePhoto: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.name);
      formDataToSend.append("email", formData.email);
      if (formData.profilePhoto) {
        formDataToSend.append("profilePhoto", formData.profilePhoto);
      }

      const res = await fetch(`${VITE_API_URL}/auth/update-profile`, {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        toast.success("Profile updated successfully", { position: "top-center" });
        setPreviewImage(null);
        setFormData((prev) => ({ ...prev, profilePhoto: null }));
      } else {
        toast.error(data.message || "Failed to update profile", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error updating profile: Network or server issue", { position: "top-center" });
    }
  };

  if (!user) {
    return <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />;
  }

  const profileImage = previewImage || user.profilePhoto || userProfileImage;
  const displayName = user.name || "Guest";
  const roleLabel = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Profile Photo */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-600">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3177/3177465.png"
          alt={displayName}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = fallbackImage)}
        />
      </div>

      {/* Role Badge */}
      <span className="text-xs px-3 py-1 rounded-full bg-green-200 text-green-800">
        {roleLabel}
      </span>

      {/* Details Form */}
      <form onSubmit={handleUpdateProfile} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
          <input
            type="file"
            name="profilePhoto"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleChange}
            className="w-full mt-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={roleLabel}
            disabled
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
