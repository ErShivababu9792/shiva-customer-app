import { useState } from "react";
import { MapPin } from "lucide-react";

const emptyAddress = { label: "Home", fullName: "", phone: "", line1: "", line2: "", landmark: "", city: "", state: "", pincode: "", lat: null, lng: null };

const inputClass = "w-full border border-sand bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clay";

const AddressForm = ({ initialValues, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initialValues || emptyAddress);
  const [locating, setLocating] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, pincode: value }));
    if (!/^\d{6}$/.test(value)) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
      const data = await res.json();
      const postOffice = data?.[0]?.PostOffice?.[0];
      if (data?.[0]?.Status === "Success" && postOffice) {
        setForm((prev) => ({ ...prev, city: postOffice.District || prev.city, state: postOffice.State || prev.state }));
      }
    } catch {} finally {
      setPincodeLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.address || {};
          setForm((prev) => ({
            ...prev,
            line1: prev.line1 || [addr.house_number, addr.road].filter(Boolean).join(" ") || prev.line1,
            city: addr.city || addr.town || addr.village || prev.city,
            state: addr.state || prev.state,
            pincode: addr.postcode || prev.pincode,
            lat: latitude,
            lng: longitude,
          }));
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <button type="button" onClick={handleUseLocation} disabled={locating} className="flex items-center gap-2 text-sm text-clay font-medium">
        <MapPin size={15} /> {locating ? "Detecting…" : form.lat ? "Location pinned ✓ — tap to re-detect" : "Use current location"}
      </button>
      {!form.lat && (
        <p className="text-xs text-clay -mt-1">
          Tip: tap "Use current location" so we can confirm delivery to this exact address.
        </p>
      )}
      <input required placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
      <input required placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
      <input required placeholder="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={inputClass} />
      <input placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className={inputClass} />
      <input placeholder="Landmark (optional)" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className={inputClass} />
      <input required placeholder="Pincode" maxLength={6} value={form.pincode} onChange={handlePincodeChange} className={inputClass} />
      {pincodeLoading && <p className="text-xs text-taupe -mt-1">Looking up city/state…</p>}
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
        <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} />
      </div>
      <div className="flex gap-3 pt-1">
        <button disabled={saving} className="flex-1 bg-espresso text-ivory font-medium rounded-xl py-3 text-sm disabled:opacity-50">
          {saving ? "Saving…" : "Save Address"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-taupe text-sm font-medium px-3">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;