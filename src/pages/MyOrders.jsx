import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Package } from "lucide-react";
import api from "../api/axios.js";

const formatPrice = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const statusStyle = {
  placed: "bg-slate-500/15 text-slate-600",
  confirmed: "bg-blue-500/15 text-blue-600",
  shipped: "bg-blue-500/15 text-blue-600",
  out_for_delivery: "bg-amber-500/15 text-amber-600",
  delivered: "bg-green-500/15 text-green-700",
  cancelled: "bg-red-500/15 text-red-700",
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ivory pb-10 safe-top">
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <h1 className="font-display text-xl text-espresso">My Orders</h1>
      </div>

      <div className="px-5 mt-2 space-y-3">
        {loading ? (
          <p className="text-taupe text-sm text-center py-16">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="text-taupe mb-3" size={40} strokeWidth={1.5} />
            <p className="text-taupe text-sm">No orders yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="block bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-espresso font-semibold text-[15px]">#{order._id.slice(-8).toUpperCase()}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[order.orderStatus] || ""}`}>
                  {order.orderStatus.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-taupe text-sm">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-taupe text-xs">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                <span className="text-espresso font-semibold text-sm">{formatPrice(order.grandTotal)}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
