import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import api from "../api/axios.js";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); setMessage("");
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center px-6 safe-top safe-bottom relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 w-9 h-9 rounded-full bg-sand flex items-center justify-center"
      >
        <X size={18} className="text-espresso" />
      </button>
      <h1 className="font-display text-xl text-espresso text-center">Forgot Password</h1>
      <p className="text-taupe text-sm text-center mt-2 mb-8">We'll email you a reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white border border-sand rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-clay"
        />
        {message && <p className="text-green-700 text-sm px-1">{message}</p>}
        {error && <p className="text-red-700 text-sm px-1">{error}</p>}
        <button disabled={loading} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3.5 text-[15px] disabled:opacity-50">
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
      <Link to="/login" className="text-clay text-sm text-center mt-6 block">Back to Login</Link>
    </div>
  );
};

export default ForgotPassword;