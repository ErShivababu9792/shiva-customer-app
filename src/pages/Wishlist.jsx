import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const Wishlist = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/wishlist").then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ivory pb-10 safe-top">
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <h1 className="font-display text-xl text-espresso">Wishlist</h1>
      </div>

      <div className="px-5 mt-2">
        {loading ? (
          <p className="text-taupe text-sm text-center py-16">Loading…</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="text-taupe mb-3" size={40} strokeWidth={1.5} />
            <p className="text-taupe text-sm mb-4">Your wishlist is empty.</p>
            <button onClick={() => navigate("/categories")} className="bg-espresso text-ivory px-6 py-2.5 rounded-full text-sm font-medium">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
