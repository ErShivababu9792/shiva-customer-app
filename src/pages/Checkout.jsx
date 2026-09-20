import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, MapPin } from "lucide-react";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import AddressForm from "../components/AddressForm.jsx";

const formatPrice = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const StepIndicator = ({ current }) => {
  const steps = [
    { key: "address", label: "Address" },
    { key: "payment", label: "Payment" },
    { key: "confirm", label: "Confirm" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center px-8 py-4">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                i < currentIndex ? "bg-clay text-ivory" : i === currentIndex ? "bg-espresso text-ivory" : "bg-sand text-taupe"
              }`}
            >
              {i < currentIndex ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[11px] mt-1 ${i <= currentIndex ? "text-espresso" : "text-taupe"}`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < currentIndex ? "bg-clay" : "bg-sand"}`} />}
        </div>
      ))}
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState("address");

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);

  useEffect(() => {
    api.get("/auth/addresses").then(({ data }) => {
      setSavedAddresses(data.addresses);
      const def = data.addresses.find((a) => a.isDefault) || data.addresses[0];
      if (def) setSelectedAddressId(def._id);
      else setShowAddForm(true);
    });
  }, []);

  const selectedAddress = savedAddresses.find((a) => a._id === selectedAddressId);

  const handleSaveAddress = async (formData) => {
    setAddingAddress(true);
    setError("");
    try {
      const { data } = await api.post("/auth/addresses", formData);
      setSavedAddresses(data.addresses);
      setSelectedAddressId(data.addresses[data.addresses.length - 1]._id);
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save address.");
    } finally {
      setAddingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      if (paymentMethod === "razorpay") {
        const { data } = await api.post("/payments/razorpay/create-order");
        if (!window.Razorpay) {
          setError("Payment widget failed to load.");
          setPlacing(false);
          return;
        }
        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: "Shiva Build Mart",
          prefill: { name: selectedAddress.fullName, contact: selectedAddress.phone },
          handler: async (response) => {
            const verifyRes = await api.post("/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: selectedAddress,
            });
            await clearCart();
            setPlacedOrder(verifyRes.data.order);
            setStep("confirm");
            setPlacing(false);
          },
          modal: { ondismiss: () => setPlacing(false) },
          theme: { color: "#2B2420" },
        });
        rzp.open();
      } else {
        const { data } = await api.post("/orders", { shippingAddress: selectedAddress, paymentMethod });
        await clearCart();
        setPlacedOrder(data.order);
        setStep("confirm");
        setPlacing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order.");
      setPlacing(false);
    }
  };

  if (step === "confirm" && placedOrder) {
    return (
      <div className="min-h-screen bg-ivory safe-top flex flex-col">
        <div className="flex items-center gap-3 px-5 pt-4">
          <h1 className="font-display text-xl text-espresso">Order Confirmed</h1>
        </div>
        <StepIndicator current="confirm" />
        <div className="flex-1 flex flex-col items-center px-6 pt-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
            <Check size={36} className="text-green-700" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl text-espresso">Order Placed!</h2>
          <p className="text-taupe text-sm mt-1 text-center">Thank you for shopping with Shiva Build Mart</p>

          {/* Receipt-style summary, like a printed slip */}
          <div className="w-full max-w-[340px] mt-6">
            <div className="bg-white rounded-t-lg p-5 font-mono text-[13px] text-espresso">
              <p className="text-center font-semibold text-sm tracking-wide">SHIVA BUILD MART</p>
              <p className="text-center text-taupe text-[11px] mb-3">Order Receipt</p>
              <div className="border-t border-dashed border-taupe/40 my-3" />

              <div className="flex justify-between"><span>Order ID</span><span>#{placedOrder._id.slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span>Date</span><span>{new Date(placedOrder.createdAt || Date.now()).toLocaleDateString("en-IN")}</span></div>
              <div className="flex justify-between"><span>Payment</span><span className="uppercase">{placedOrder.paymentMethod}</span></div>

              <div className="border-t border-dashed border-taupe/40 my-3" />

              {placedOrder.items?.map((item, i) => (
                <div key={i} className="flex justify-between gap-2 mb-1">
                  <span className="flex-1 truncate">{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              <div className="border-t border-dashed border-taupe/40 my-3" />

              <div className="flex justify-between font-semibold text-sm">
                <span>TOTAL</span>
                <span>{formatPrice(placedOrder.grandTotal)}</span>
              </div>

              <div className="border-t border-dashed border-taupe/40 my-3" />

              <p className="text-[11px] text-taupe">Deliver to:</p>
              <p className="text-[11px]">
                {placedOrder.shippingAddress.fullName}, {placedOrder.shippingAddress.line1}, {placedOrder.shippingAddress.city}
              </p>
              <p className="text-center text-[10px] text-taupe mt-4">*** Thank you for your order ***</p>
            </div>
            {/* Zigzag torn-paper edge */}
            <div
              className="h-4 w-full"
              style={{
                background:
                  "linear-gradient(-45deg, transparent 8px, #fff 8px) 0 0/16px 100%, linear-gradient(45deg, transparent 8px, #fff 8px) 0 0/16px 100%",
                backgroundColor: "transparent",
              }}
            />
          </div>

          <button
            onClick={() => navigate(`/orders/${placedOrder._id}`)}
            className="w-full bg-espresso text-ivory font-medium rounded-xl py-3.5 text-sm mt-6"
          >
            View Order Details
          </button>
          <button onClick={() => navigate("/")} className="w-full text-espresso font-medium text-sm mt-3 py-2">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-24 safe-top">
      <div className="flex items-center gap-3 px-5 pt-4">
        <button onClick={() => (step === "address" ? navigate(-1) : setStep("address"))}>
          <ChevronLeft size={24} className="text-espresso" />
        </button>
        <h1 className="font-display text-xl text-espresso">Checkout</h1>
      </div>

      <StepIndicator current={step} />

      {step === "address" && (
        <div className="px-5 mt-2 space-y-3">
          {savedAddresses.map((addr) => (
            <label
              key={addr._id}
              className={`block bg-white rounded-2xl p-4 border-2 ${selectedAddressId === addr._id ? "border-clay" : "border-transparent"}`}
            >
              <div className="flex items-start gap-3">
                <input type="radio" checked={selectedAddressId === addr._id} onChange={() => setSelectedAddressId(addr._id)} className="mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-clay" />
                    <p className="text-espresso font-medium text-sm">{addr.fullName}</p>
                  </div>
                  <p className="text-taupe text-sm mt-1">{addr.phone}</p>
                  <p className="text-taupe text-sm">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              </div>
            </label>
          ))}

          {showAddForm ? (
            <div className="bg-white rounded-2xl p-4">
              <AddressForm onSave={handleSaveAddress} onCancel={savedAddresses.length > 0 ? () => setShowAddForm(false) : undefined} saving={addingAddress} />
            </div>
          ) : (
            <button onClick={() => setShowAddForm(true)} className="w-full border border-dashed border-taupe text-espresso font-medium rounded-2xl py-3.5 text-sm">
              + Add New Address
            </button>
          )}

          {error && <p className="text-red-700 text-sm">{error}</p>}

          <div className="fixed bottom-0 left-0 right-0 bg-ivory border-t border-sand px-5 py-3 flex items-center justify-between safe-bottom">
            <div>
              <p className="text-taupe text-xs">Total Amount</p>
              <p className="text-espresso font-semibold text-lg">{formatPrice(subtotal)}</p>
            </div>
            <button
              onClick={() => setStep("payment")}
              disabled={!selectedAddress}
              className="bg-clay text-ivory font-medium rounded-xl px-6 py-3 text-sm disabled:opacity-50"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="px-5 mt-2 space-y-3">
          <p className="text-espresso font-medium text-[15px] mb-1">Payment Method</p>
          {[
            { key: "razorpay", label: "Pay Online", sub: "Card, UPI, Netbanking, Wallets" },
            { key: "upi", label: "UPI / QR", sub: "Pay using any UPI app" },
            { key: "cod", label: "Cash on Delivery", sub: "Pay at your doorstep" },
          ].map((method) => (
            <button
              key={method.key}
              onClick={() => setPaymentMethod(method.key)}
              className={`w-full flex items-center justify-between bg-white rounded-2xl p-4 border-2 ${
                paymentMethod === method.key ? "border-clay" : "border-transparent"
              }`}
            >
              <div className="text-left">
                <p className="text-espresso font-medium text-sm">{method.label}</p>
                <p className="text-taupe text-xs mt-0.5">{method.sub}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === method.key ? "border-clay bg-clay" : "border-sand"}`} />
            </button>
          ))}

          {error && <p className="text-red-700 text-sm">{error}</p>}

          <div className="fixed bottom-0 left-0 right-0 bg-ivory border-t border-sand px-5 py-3 flex items-center justify-between safe-bottom">
            <div>
              <p className="text-taupe text-xs">Total Amount</p>
              <p className="text-espresso font-semibold text-lg">{formatPrice(subtotal)}</p>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="bg-clay text-ivory font-medium rounded-xl px-6 py-3 text-sm disabled:opacity-50"
            >
              {placing ? "Placing…" : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;