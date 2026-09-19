import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const inputClass = "w-full border border-sand bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clay";

const Settings = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [businessForm, setBusinessForm] = useState({ businessName: user?.businessName || "", gstin: user?.gstin || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving("profile"); setMessage(""); setError("");
    try {
      await updateProfile(profileForm);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving("");
    }
  };

  const handleSaveBusiness = async (e) => {
    e.preventDefault();
    setSaving("business"); setMessage(""); setError("");
    try {
      await updateProfile(businessForm);
      setMessage("Business details saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save.");
    } finally {
      setSaving("");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setSaving("password");
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setMessage("Password updated.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not update password.");
    } finally {
      setSaving("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-ivory pb-10 safe-top">
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <h1 className="font-display text-xl text-espresso">Settings</h1>
      </div>

      <div className="px-5 mt-2 space-y-4">
        {message && <p className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3">{message}</p>}
        {error && <p className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">{error}</p>}

        <div className="bg-white rounded-2xl p-4">
          <p className="text-espresso font-medium text-[15px] mb-3">Profile</p>
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <input value={user?.email || ""} disabled className={`${inputClass} bg-sand/40 text-taupe`} />
            <input placeholder="Full name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={inputClass} />
            <input placeholder="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className={inputClass} />
            <button disabled={saving === "profile"} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3 text-sm disabled:opacity-50">
              {saving === "profile" ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <p className="text-espresso font-medium text-[15px] mb-1">Business / GST Details</p>
          <p className="text-taupe text-xs mb-3">Auto-fills at checkout when you request a GST invoice.</p>
          <form onSubmit={handleSaveBusiness} className="space-y-3">
            <input placeholder="Business Name" value={businessForm.businessName} onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })} className={inputClass} />
            <input placeholder="GSTIN" maxLength={15} value={businessForm.gstin} onChange={(e) => setBusinessForm({ ...businessForm, gstin: e.target.value.toUpperCase() })} className={inputClass} />
            <button disabled={saving === "business"} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3 text-sm disabled:opacity-50">
              {saving === "business" ? "Saving…" : "Save"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <p className="text-espresso font-medium text-[15px] mb-3">Change Password</p>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input type="password" required placeholder="Current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className={inputClass} />
            <input type="password" required minLength={8} placeholder="New password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className={inputClass} />
            <input type="password" required minLength={8} placeholder="Confirm new password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className={inputClass} />
            <button disabled={saving === "password"} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3 text-sm disabled:opacity-50">
              {saving === "password" ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>

        <button onClick={handleLogout} className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-3 text-red-700 font-medium text-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
