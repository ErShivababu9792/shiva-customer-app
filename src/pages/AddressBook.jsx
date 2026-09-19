import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Star } from "lucide-react";
import api from "../api/axios.js";
import AddressForm from "../components/AddressForm.jsx";

const AddressBook = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = () => {
    setLoading(true);
    api.get("/auth/addresses").then(({ data }) => setAddresses(data.addresses)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async (formData) => {
    setSaving(true);
    try {
      const { data } = await api.post("/auth/addresses", formData);
      setAddresses(data.addresses);
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/auth/addresses/${id}`, formData);
      setAddresses(data.addresses);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this address?")) return;
    const { data } = await api.delete(`/auth/addresses/${id}`);
    setAddresses(data.addresses);
  };

  const handleSetDefault = async (id) => {
    const { data } = await api.put(`/auth/addresses/${id}/default`);
    setAddresses(data.addresses);
  };

  return (
    <div className="min-h-screen bg-ivory pb-10 safe-top">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
          <h1 className="font-display text-xl text-espresso">Address Book</h1>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="text-clay text-sm font-medium">+ Add New</button>
        )}
      </div>

      <div className="px-5 mt-2 space-y-3">
        {loading ? (
          <p className="text-taupe text-sm text-center py-16">Loading…</p>
        ) : (
          <>
            {addresses.map((addr) =>
              editingId === addr._id ? (
                <div key={addr._id} className="bg-white rounded-2xl p-4">
                  <AddressForm initialValues={addr} onSave={(formData) => handleUpdate(addr._id, formData)} onCancel={() => setEditingId(null)} saving={saving} />
                </div>
              ) : (
                <div key={addr._id} className="bg-white rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-clay shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-espresso font-medium text-sm">{addr.fullName}</p>
                        {addr.isDefault && <span className="text-[10px] text-clay bg-clay/10 px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-taupe text-sm mt-1">{addr.phone}</p>
                      <p className="text-taupe text-sm">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}{addr.landmark ? `, near ${addr.landmark}` : ""}
                        <br />{addr.city}, {addr.state} {addr.pincode}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <button onClick={() => setEditingId(addr._id)} className="text-clay font-medium">Edit</button>
                        {!addr.isDefault && (
                          <button onClick={() => handleSetDefault(addr._id)} className="text-taupe font-medium flex items-center gap-1">
                            <Star size={12} /> Set Default
                          </button>
                        )}
                        <button onClick={() => handleDelete(addr._id)} className="text-red-700 font-medium">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {showAddForm && (
              <div className="bg-white rounded-2xl p-4">
                <AddressForm onSave={handleAdd} onCancel={addresses.length > 0 ? () => setShowAddForm(false) : undefined} saving={saving} />
              </div>
            )}

            {addresses.length === 0 && !showAddForm && (
              <p className="text-taupe text-sm text-center py-16">No saved addresses yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddressBook;
