import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Phone, Mail } from "lucide-react";
import api from "../api/axios.js";

const Help = () => {
  const navigate = useNavigate();
  const [biz, setBiz] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/settings/public").then(({ data }) => setBiz(data)).catch(() => setBiz({}));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess(""); setError("");
    try {
      const { data } = await api.post("/contact", form);
      setSuccess(data.message);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not send message.");
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full border border-sand bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-clay";

  return (
    <div className="min-h-screen bg-ivory pb-10 safe-top">
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <h1 className="font-display text-xl text-espresso">Help & Support</h1>
      </div>

      <div className="px-5 mt-2 space-y-4">
        {(biz?.phone || biz?.email) && (
          <div className="bg-white rounded-2xl p-4 space-y-3">
            {biz.phone && (
              <a href={`tel:${biz.phone}`} className="flex items-center gap-3 text-espresso text-sm font-medium">
                <Phone size={18} className="text-clay" /> {biz.phone}
              </a>
            )}
            {biz.email && (
              <a href={`mailto:${biz.email}`} className="flex items-center gap-3 text-espresso text-sm font-medium">
                <Mail size={18} className="text-clay" /> {biz.email}
              </a>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl p-4">
          <p className="text-espresso font-medium text-[15px] mb-3">Send us a message</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            <input type="email" required placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            <textarea required rows={4} placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
            {success && <p className="text-green-700 text-sm">{success}</p>}
            {error && <p className="text-red-700 text-sm">{error}</p>}
            <button disabled={sending} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3 text-sm disabled:opacity-50">
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Help;
