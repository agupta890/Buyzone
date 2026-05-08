import { useEffect, useState } from "react";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

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
  const [showForm, setShowForm] = useState(false); // 🔹 State to hide/show form

  // 🔹 Load from backend + cookie cache
  useEffect(() => {
    const cookieData = Cookies.get("user_addresses");
    const savedSelectedId = Cookies.get("selected_address_id");

    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
          // If we have a saved ID, notify parent immediately
          if (savedSelectedId) {
            setSelectedId(savedSelectedId);
            if (onSelectAddress) onSelectAddress(savedSelectedId);
          }
        }
      } catch {
        Cookies.remove("user_addresses");
      }
    }

    fetch(`${API_URL}/api/address`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch addresses");
        return res.json();
      })
      .then((data) => {
        const fetchedAddresses = data.addresses || [];
        setAddresses(fetchedAddresses);
        Cookies.set("user_addresses", JSON.stringify(fetchedAddresses), { expires: 1 });
        
        // Auto-select logic: ensure saved ID still exists in fetched data
        if (savedSelectedId && fetchedAddresses.find(a => a._id === savedSelectedId)) {
            setSelectedId(savedSelectedId);
            if (onSelectAddress) onSelectAddress(savedSelectedId);
        } else if (fetchedAddresses.length > 0 && !savedSelectedId) {
            // Optional: Auto-select first address if none saved yet
            // handleSelect(fetchedAddresses[0]._id);
        }
      })
      .catch((err) => console.error("Failed to fetch addresses:", err));
  }, []);

  // 🔹 Handle Save (Add or Edit)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${API_URL}/api/address/${editingId}`
        : `${API_URL}/api/address`;
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
        
        // If it's a new address and none selected, auto-select it
        if (!editingId && !selectedId) {
            handleSelect(data.address._id);
        }

        resetForm();
      } else {
        alert(data.error || "Failed to save address");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving address");
    }
  };

  const resetForm = () => {
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
    setShowForm(false);
  };

  // 🔹 Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      const res = await fetch(`${API_URL}/api/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        const updated = addresses.filter((a) => a._id !== id);
        setAddresses(updated);
        Cookies.set("user_addresses", JSON.stringify(updated), { expires: 1 });
        if (selectedId === id) {
            setSelectedId(null);
            Cookies.remove("selected_address_id");
            if (onSelectAddress) onSelectAddress(null);
        }
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
    setShowForm(true); // 🔹 Show form on edit
  };

  // 🔹 Handle Select
  const handleSelect = (id) => {
    setSelectedId(id);
    Cookies.set("selected_address_id", id, { expires: 7 }); // Permanent for 7 days
    if (onSelectAddress) onSelectAddress(id);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Delivery Address
        </h1>
        {addresses.length > 0 && !showForm && (
            <button 
                onClick={() => setShowForm(true)}
                className="text-sm font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider"
            >
                + Add New
            </button>
        )}
      </div>

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="grid gap-4 mb-8">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => handleSelect(addr._id)}
              className={`p-4 border-2 rounded-xl transition-all cursor-pointer relative ${
                selectedId === addr._id
                  ? "border-amber-500 bg-amber-50/30 shadow-md"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              {selectedId === addr._id && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full shadow-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                  </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{addr.name}</p>
                    {selectedId === addr._id && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Selected</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {addr.house_no} {addr.street}, {addr.city}, {addr.state} -{" "}
                    {addr.pincode}
                  </p>
                  <p className="text-xs font-bold text-gray-400 mt-2">📞 {addr.phone}</p>
                </div>
                
                <div className="flex gap-3 sm:self-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleEdit(addr)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit Address"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Address"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 mb-8">
            <p className="text-gray-500 mb-4">No addresses saved yet.</p>
            <button 
                onClick={() => setShowForm(true)}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-amber-500 transition-all"
            >
                Add Your First Address
            </button>
        </div>
      ) : null}

      {/* Add/Edit Address Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
              {editingId ? "Update Address" : "New Shipping Address"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 text-sm font-bold uppercase tracking-widest">Cancel</button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all"
                      required
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                    <input
                      inputMode="numeric"
                      minLength="10"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all"
                      required
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">House No. / Building</label>
                <input
                  type="text"
                  placeholder="Flat, House no., Building, Company, Apartment"
                  value={form.house_no}
                  onChange={(e) => setForm({ ...form, house_no: e.target.value })}
                  className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all"
                  required
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                <input
                  type="text"
                  placeholder="Area, Colony, Street, Sector, Village"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all"
                  required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="6 Digits"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all"
                      required
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                    <input
                      type="text"
                      placeholder="Town/City"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all"
                      required
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">State</label>
                    <select
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none"
                        required
                    >
                        <option value="">Select State</option>
                        {[
                          "Andhra Pradesh", "Delhi", "Haryana", "Kerala", "Madhya Pradesh", "Gujarat", "Karnataka", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "Uttarakhand", "West Bengal",
                        ].sort().map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. near Apollo Hospital"
                  value={form.nearest}
                  onChange={(e) => setForm({ ...form, nearest: e.target.value })}
                  className="w-full bg-gray-50 border-none p-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
            </div>

            <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-amber-500 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                >
                  {editingId ? "Update Address" : "Save Shipping Address"}
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
