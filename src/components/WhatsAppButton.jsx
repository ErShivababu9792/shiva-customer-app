import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import api from "../api/axios.js";

const WhatsAppButton = () => {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    api.get("/settings/public").then(({ data }) => setPhone(data.phone || "")).catch(() => {});
  }, []);

  if (!phone) return null;

  const digitsOnly = phone.replace(/\D/g, "");
  const withCountryCode = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
  const waLink = `https://wa.me/${withCountryCode}?text=${encodeURIComponent("Hi, I have a question about a product on Shiva Build Mart.")}`;

    return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-5 z-40 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg"
      style={{ width: 52, height: 52 }}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={24} fill="white" strokeWidth={0} />
    </a>
  );
};

export default WhatsAppButton;