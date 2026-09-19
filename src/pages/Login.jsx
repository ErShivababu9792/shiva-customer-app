import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
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
      <div className="mx-auto w-16 h-16 rounded-2xl bg-espresso flex items-center justify-center mb-6">
        <span className="text-ivory font-display text-2xl">S</span>
      </div>
      <h1 className="font-display text-2xl text-espresso text-center">Welcome Back</h1>
      <p className="text-taupe text-center text-sm mt-1 mb-10">Log in to Shiva Build Mart</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email" required placeholder="Email" autoComplete="username"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-white border border-sand rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-clay"
        />
        <input
          type="password" required placeholder="Password" autoComplete="current-password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full bg-white border border-sand rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-clay"
        />
        {error && <p className="text-red-700 text-sm px-1">{error}</p>}
        <button disabled={loading} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3.5 text-[15px] mt-2 disabled:opacity-50">
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>

      <Link to="/forgot-password" className="text-taupe text-sm text-center mt-5 block">Forgot password?</Link>
      <p className="text-taupe text-sm text-center mt-8">
        New here?{" "}
        <Link to="/register" className="text-clay font-medium">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;