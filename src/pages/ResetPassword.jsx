import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { X } from "lucide-react";
import api from "../api/axios.js";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center safe-top safe-bottom">
        <h1 className="font-display text-xl text-espresso">Invalid Link</h1>
        <p className="text-taupe text-sm mt-2">This reset link is missing its token.</p>
        <Link to="/forgot-password" className="text-clay font-medium mt-6">Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center px-6 safe-top safe-bottom relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 w-9 h-9 rounded-full bg-sand flex items-center justify-center"
      >
        <X size={18} className="text-espresso" />
      </button>
      <h1 className="font-display text-xl text-espresso text-center mb-8">Set New Password</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password" required minLength={8} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white border border-sand rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-clay"
        />
        <input
          type="password" required minLength={8} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-white border border-sand rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-clay"
        />
        {error && <p className="text-red-700 text-sm px-1">{error}</p>}
        <button disabled={loading} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3.5 text-[15px] disabled:opacity-50">
          {loading ? "Resetting…" : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;