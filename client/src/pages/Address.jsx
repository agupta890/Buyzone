import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [editingId, setEditingId] = useState(null); // track if editing

  // Load from cookies + fetch from backend
  useEffect(() => {
    const cookieData = Cookies.get("user_addresses");
    if (cookieData) {
      setAddresses(JSON.parse(cookieData));
    }

    fetch("http://localhost:3000/api/address", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data.addresses || []);
        Cookies.set("user_addresses", JSON.stringify(data.addresses), {
          expires: 1,
        });
      })
      .catch(() => console.error("Failed to fetch addresses"));
  }, []);

  // Save or Update address
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3000/api/address/${editingId}`
        : "http://localhost:3000/api/address";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        let updated;
        if (editingId) {
          // replace updated address in state
          updated = addresses.map((a) =>
            a._id === editingId ? data.address : a
          );
          alert("Address updated ✨");
        } else {
          updated = [...addresses, data.address];
          alert("Address saved ✅");
        }
        setAddresses(updated);
        Cookies.set("user_addresses", JSON.stringify(updated), { expires: 1 });

        // reset
        setForm({
          name: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
        });
        setEditingId(null);
      } else {
        alert(data.error || "Failed to save address");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving address");
    }
  };

  // Delete address
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const res = await fetch(`api/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const updated = addresses.filter((a) => a._id !== id);
        setAddresses(updated);
        Cookies.set("user_addresses", JSON.stringify(updated), { expires: 1 });
        alert("Address deleted 🗑️");
      } else {
        alert("Failed to delete address");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting address");
    }
  };

  // Start editing
  const handleEdit = (addr) => {
    setForm({
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setEditingId(addr._id);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        My Addresses <HomeOutlinedIcon color="inherit" fontSize="inherit" />
      </h1>

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="grid gap-4 mb-8">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="p-4 border rounded-lg bg-white shadow hover:shadow-md transition"
            >
              <p className="font-semibold">{addr.name}</p>
              <p>
                {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-gray-600">
                {" "}
                <CallOutlinedIcon fontSize="inherit" /> {addr.phone}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEdit(addr)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <EditLocationOutlinedIcon />
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-700"
                >
                  <DeleteOutlineOutlinedIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mb-8">No addresses saved yet.</p>
      )}

      {/* Add / Edit Address Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
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
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
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

        <input
          type="text"
          placeholder="Street Address"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <select
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Andaman and Nicobar Islands">
              Andaman and Nicobar Islands
            </option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Dadra and Nagar Haveli and Daman and Diu">
              Dadra and Nagar Haveli and Daman and Diu
            </option>
            <option value="Delhi">Delhi</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Puducherry">Puducherry</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
        >
          {editingId ? "Update Address" : "Save Address"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                pincode: "",
              });
            }}
            className="ml-3 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded font-semibold"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
