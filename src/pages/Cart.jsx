import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { cldResize } from "../utils/image.js";

const formatPrice = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateItem, removeItem } = useCart();

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);

  return (
    <div className="min-h-screen bg-ivory pb-6 safe-top">
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <h1 className="font-display text-xl text-espresso">My Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center px-8">
          <ShoppingBag className="text-taupe mb-3" size={40} strokeWidth={1.5} />
          <p className="text-taupe text-sm mb-4">Your cart is empty.</p>
          <button onClick={() => navigate("/categories")} className="bg-espresso text-ivory px-6 py-2.5 rounded-full text-sm font-medium">
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="px-5 mt-2 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex gap-3 bg-white rounded-2xl p-3">
                <div className="w-16 h-16 bg-sand rounded-xl overflow-hidden shrink-0">
                  {item.product?.images?.[0]?.url && (
                    <img src={cldResize(item.product.images[0].url, 150)} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-espresso text-sm font-medium truncate">{item.product?.name}</p>
                  {item.variantLabel && <p className="text-taupe text-xs mt-0.5">{item.variantLabel}</p>}
                  <p className="text-espresso font-semibold text-sm mt-1">{formatPrice(item.priceAtAdd)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item._id)}>
                    <Trash2 size={16} className="text-taupe" />
                  </button>
                  <div className="flex items-center border border-sand rounded-lg">
                    <button onClick={() => updateItem(item._id, Math.max(1, item.quantity - 1))} className="w-7 h-7 text-espresso text-sm">−</button>
                    <span className="w-6 text-center text-xs">{item.quantity}</span>
                    <button onClick={() => updateItem(item._id, item.quantity + 1)} className="w-7 h-7 text-espresso text-sm">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 mt-6">
            <div className="bg-white rounded-2xl p-4">
              <p className="text-espresso font-medium text-[15px] mb-3">Price Details</p>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-taupe">Subtotal</span>
                <span className="text-espresso">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-taupe">Shipping</span>
                <span className="text-espresso">Free</span>
              </div>
              <div className="flex justify-between border-t border-sand pt-3 font-semibold">
                <span className="text-espresso">Total</span>
                <span className="text-espresso">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-clay text-ivory font-medium rounded-xl py-3.5 text-[15px] mt-4"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
