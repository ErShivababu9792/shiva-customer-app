import { useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, QrCode, Banknote } from "lucide-react";

const PaymentMethods = () => {
  const navigate = useNavigate();

  const methods = [
    { icon: CreditCard, title: "Pay Online", desc: "Card, UPI, Netbanking, or Wallets via our secure payment partner" },
    { icon: QrCode, title: "UPI / QR", desc: "Scan and pay using any UPI app" },
    { icon: Banknote, title: "Cash on Delivery", desc: "Pay in cash when your order arrives" },
  ];

  return (
    <div className="min-h-screen bg-ivory pb-10 safe-top">
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <h1 className="font-display text-xl text-espresso">Payment Methods</h1>
      </div>
      <p className="text-taupe text-sm px-5 mt-1 mb-4">These are chosen at checkout — nothing to save here in advance.</p>

      <div className="px-5 space-y-3">
        {methods.map((m) => (
          <div key={m.title} className="bg-white rounded-2xl p-4 flex items-start gap-3">
            <m.icon size={20} className="text-clay shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-espresso font-medium text-sm">{m.title}</p>
              <p className="text-taupe text-sm mt-0.5">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
