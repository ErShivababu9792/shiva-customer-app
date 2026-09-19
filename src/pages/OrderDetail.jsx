import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star, Phone } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import StarRating from "../components/StarRating.jsx";

const formatPrice = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ReviewWidget = ({ productId, existingReview, onSaved }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) { setError("Select a rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, { rating, comment });
      onSaved(data.review);
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return <button onClick={() => setOpen(true)} className="text-clay text-xs font-medium mt-1">{existingReview ? "Edit Review" : "Rate & Review"}</button>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 bg-sand/40 rounded-xl p-3 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onClick={() => setRating(i)}>
            <Star size={20} fill={i <= rating ? "#B5622C" : "none"} stroke="#B5622C" strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <textarea rows={2} placeholder="Share your experience" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border border-sand bg-white rounded-lg px-3 py-2 text-sm" />
      {error && <p className="text-red-700 text-xs">{error}</p>}
      <div className="flex gap-2">
        <button disabled={submitting} className="bg-espresso text-ivory px-4 py-1.5 rounded-lg text-xs font-medium">{submitting ? "Saving…" : "Submit"}</button>
        <button type="button" onClick={() => setOpen(false)} className="text-taupe text-xs">Cancel</button>
      </div>
    </form>
  );
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [myReviews, setMyReviews] = useState({});
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order));
  }, [id]);

  useEffect(() => {
    if (!order || order.orderStatus !== "delivered" || !user) return;
    const ids = [...new Set(order.items.map((i) => i.product))];
    Promise.all(
      ids.map((pid) => api.get(`/products/${pid}/reviews`).then(({ data }) => ({ pid, review: data.reviews.find((r) => r.user === user.id) })).catch(() => ({ pid, review: null })))
    ).then((results) => {
      const map = {};
      results.forEach(({ pid, review }) => { if (review) map[pid] = review; });
      setMyReviews(map);
    });
  }, [order, user]);

  const handleCancel = async () => {
    if (!confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrder(data.order);
    } finally {
      setCancelling(false);
    }
  };

  if (!order) return <div className="min-h-screen bg-ivory flex items-center justify-center text-taupe text-sm">Loading…</div>;

  return (
    <div className="min-h-screen bg-ivory pb-10 safe-top">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
          <h1 className="font-display text-lg text-espresso">#{order._id.slice(-8).toUpperCase()}</h1>
        </div>
        <a href={`${API_BASE}/orders/${order._id}/invoice`} target="_blank" rel="noopener noreferrer" className="text-clay text-xs font-medium">
          Invoice
        </a>
      </div>

      <div className="px-5 mt-3">
        <span className="inline-block bg-sand text-espresso text-xs font-medium px-3 py-1.5 rounded-full capitalize">
          {order.orderStatus.replace(/_/g, " ")}
        </span>

        {order.orderStatus === "placed" && (
          <button onClick={handleCancel} disabled={cancelling} className="block text-red-700 text-sm font-medium mt-3">
            {cancelling ? "Cancelling…" : "Cancel Order"}
          </button>
        )}

        {order.assignedDeliveryBoy && ["out_for_delivery", "delivered"].includes(order.orderStatus) && (
          <div className="bg-white rounded-2xl p-4 mt-4">
            <p className="text-taupe text-xs mb-1">Delivery Partner</p>
            <div className="flex items-center justify-between">
              <p className="text-espresso font-medium text-sm">{order.assignedDeliveryBoy.name}</p>
              <a href={`tel:${order.assignedDeliveryBoy.phone}`} className="flex items-center gap-1 text-clay text-sm font-medium">
                <Phone size={14} /> Call
              </a>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 mt-4 space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="text-espresso">{item.name}{item.variantLabel && <span className="text-taupe"> ({item.variantLabel})</span>}</p>
                <p className="text-taupe text-xs mt-0.5">Qty: {item.quantity}</p>
                {order.orderStatus === "delivered" && (
                  <>
                    {myReviews[item.product] && <div className="mt-1"><StarRating rating={myReviews[item.product].rating} size={12} /></div>}
                    <ReviewWidget productId={item.product} existingReview={myReviews[item.product]} onSaved={(r) => setMyReviews((prev) => ({ ...prev, [item.product]: r }))} />
                  </>
                )}
              </div>
              <span className="text-espresso shrink-0 ml-3">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-taupe">Taxable Value</span><span className="text-espresso">{formatPrice(order.itemsTotal)}</span></div>
          {order.totalCGST > 0 && (
            <>
              <div className="flex justify-between"><span className="text-taupe">CGST</span><span className="text-espresso">{formatPrice(order.totalCGST)}</span></div>
              <div className="flex justify-between"><span className="text-taupe">SGST</span><span className="text-espresso">{formatPrice(order.totalSGST)}</span></div>
            </>
          )}
          {order.totalIGST > 0 && <div className="flex justify-between"><span className="text-taupe">IGST</span><span className="text-espresso">{formatPrice(order.totalIGST)}</span></div>}
          <div className="flex justify-between font-semibold pt-2 border-t border-sand"><span className="text-espresso">Total</span><span className="text-espresso">{formatPrice(order.grandTotal)}</span></div>
        </div>

        <div className="bg-white rounded-2xl p-4 mt-4">
          <p className="text-taupe text-xs mb-1">Delivery Address</p>
          <p className="text-espresso text-sm">
            {order.shippingAddress.fullName}, {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
          </p>
          <p className="text-taupe text-sm mt-1">{order.shippingAddress.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
