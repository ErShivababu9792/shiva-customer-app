import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const inputClass = "w-full bg-white border border-sand rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-clay";

const Register = () => {
  const { register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeToTerms || !agreeToPrivacy) {
      setError("Please agree to the Terms & Conditions and Privacy Policy to continue.");
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, agreeToTerms, agreeToPrivacy, marketingOptIn });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await verifyOtp(form.email, otp);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(""); setInfo("");
    try {
      await resendOtp(form.email);
      setInfo("A new code has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code.");
    }
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-center px-6 safe-top safe-bottom">
        <h1 className="font-display text-xl text-espresso text-center">Verify Your Email</h1>
        <p className="text-taupe text-sm text-center mt-2 mb-8">Enter the 6-digit code sent to <span className="text-espresso">{form.email}</span></p>
        <form onSubmit={handleVerify} className="space-y-3">
          <input
            type="text" required maxLength={6} inputMode="numeric" placeholder="6-digit code"
            value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className={`${inputClass} text-center text-2xl tracking-[0.5em]`}
          />
          {error && <p className="text-red-700 text-sm px-1">{error}</p>}
          {info && <p className="text-green-700 text-sm px-1">{info}</p>}
          <button disabled={loading || otp.length !== 6} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3.5 text-[15px] disabled:opacity-50">
            {loading ? "Verifying…" : "Verify"}
          </button>
          <button type="button" onClick={handleResend} className="w-full text-taupe text-sm py-2">Resend code</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center px-6 py-12 safe-top safe-bottom">
      <h1 className="font-display text-2xl text-espresso text-center">Create Account</h1>
      <p className="text-taupe text-sm text-center mt-1 mb-8">Join Shiva Build Mart</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
        <input type="password" required minLength={8} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
        <p className="text-taupe text-xs px-1 -mt-1">8+ characters, with uppercase, lowercase, and a number.</p>
        <input type="password" required minLength={8} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />

        <div className="space-y-2 pt-1">
          <label className="flex items-start gap-2 text-xs text-taupe">
            <input type="checkbox" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="mt-0.5" />
            I agree to the Terms & Conditions
          </label>
          <label className="flex items-start gap-2 text-xs text-taupe">
            <input type="checkbox" checked={agreeToPrivacy} onChange={(e) => setAgreeToPrivacy(e.target.checked)} className="mt-0.5" />
            I agree to the Privacy Policy
          </label>
          <label className="flex items-start gap-2 text-xs text-taupe">
            <input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} className="mt-0.5" />
            Send me offers and updates (optional)
          </label>
        </div>

        {error && <p className="text-red-700 text-sm px-1">{error}</p>}
        <button disabled={loading} className="w-full bg-espresso text-ivory font-medium rounded-xl py-3.5 text-[15px] mt-2 disabled:opacity-50">
          {loading ? "Sending code…" : "Register"}
        </button>
      </form>
      <p className="text-taupe text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-clay font-medium">Login</Link>
      </p>
    </div>
  );
};

export default Register;