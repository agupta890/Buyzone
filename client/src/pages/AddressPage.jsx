import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { VITE_API_URL } from "../config";

export const AddressPage = ({ onSelectAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    house_no: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
    nearest: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // 🔹 Load from backend + cookie cache
  useEffect(() => {
    const cookieData = Cookies.get("user_addresses");
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
        }
      } catch {
        Cookies.remove("user_addresses");
      }
    }

    fetch(`${VITE_API_URL}/address`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch addresses");
        return res.json();
      })
      .then((data) => {
        const addresses = data.addresses || [];
        setAddresses(addresses);
        Cookies.set("user_addresses", JSON.stringify(addresses), { expires: 1 });
      })
      .catch((err) => console.error("Failed to fetch addresses:", err));
  }, []);

  // 🔹 Handle Save (Add or Edit)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${VITE_API_URL}/address/${editingId}`
        : `${VITE_API_URL}/address`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        const updated = editingId
          ? addresses.map((a) => (a._id === editingId ? data.address : a))
          : [...addresses, data.address];
        setAddresses(updated);
        Cookies.set("user_addresses", JSON.stringify(updated), { expires: 1 });
        setForm({
          name: "",
          phone: "",
          house_no: "",
          street: "",
          pincode: "",
          city: "",
          state: "",
          nearest: "",
        });
        setEditingId(null);
        alert(`Address ${editingId ? "updated" : "saved"} ✅`);
      } else {
        alert(data.error || "Failed to save address");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving address");
    }
  };

  // 🔹 Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      const res = await fetch(`${VITE_API_URL}/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        const updated = addresses.filter((a) => a._id !== id);
        setAddresses(updated);
        Cookies.set("user_addresses", JSON.stringify(updated), { expires: 1 });
      } else {
        alert("Failed to delete address");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting address");
    }
  };

  // 🔹 Handle Edit (prefill form)
  const handleEdit = (addr) => {
    setForm(addr);
    setEditingId(addr._id);
  };

  // 🔹 Handle Select
  const handleSelect = (id) => {
    setSelectedId(id);
    Cookies.set("selected_address_id", id, { expires: 1 });
    if (onSelectAddress) onSelectAddress(id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Delivery Address
      </h1>

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="grid gap-4 mb-8">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="p-4 border rounded-lg bg-white shadow hover:shadow-md transition flex flex-col lg:flex-row  justify-between items-center sm:items-center gap-4"
            >
              <div className="flex-1">
                <p className="font-semibold">{addr.name}</p>
                <p>
                  {addr.house_no} {addr.street}, {addr.city}, {addr.state} -{" "}
                  {addr.pincode}
                </p>
                <p className="text-gray-600">📞 {addr.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(addr)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ❌ Delete
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect(addr._id)}
                  className={`px-3 py-1 rounded ${
                    selectedId === addr._id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {selectedId === addr._id ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mb-8">No addresses saved yet.</p>
      )}

      {/* Add/Edit Address Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-lg font-bold mb-4">
          {editingId ? "Edit Address" : "Add New Address"}
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          inputMode="numeric"
          minLength={10}
          maxLength={10}
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="House No./Building Name"
          value={form.house_no}
          onChange={(e) => setForm({ ...form, house_no: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Street Address"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />

          {/* State Dropdown */}
          <select
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select State</option>
            {[
              "Andhra Pradesh",
              "Delhi",
              "Haryana",
              "Kerala",
              "Madhya Pradesh",
              "Gujarat",
              "Karnataka",
              "Maharashtra",
              "Punjab",
              "Rajasthan",
              "Tamil Nadu",
              "Uttar Pradesh",
              "Uttarakhand",
              "West Bengal",
            ].map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Nearest Landmark (optional)"
          value={form.nearest}
          onChange={(e) => setForm({ ...form, nearest: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
        >
          {editingId ? "Update Address" : "Save Address"}
        </button>
      </form>
    </div>
  );
};
