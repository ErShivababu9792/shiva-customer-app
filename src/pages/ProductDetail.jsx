import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, ChevronDown, ChevronUp } from "lucide-react";
import api from "../api/axios.js";
import { cldResize } from "../utils/image.js";
import StarRating from "../components/StarRating.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const AccordionSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border-t border-sand py-4">
    <button onClick={onToggle} className="w-full flex items-center justify-between">
      <span className="text-espresso font-medium text-[15px]">{title}</span>
      {isOpen ? <ChevronUp size={18} className="text-taupe" /> : <ChevronDown size={18} className="text-taupe" />}
    </button>
    {isOpen && <div className="mt-3">{children}</div>}
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [openSection, setOpenSection] = useState("description");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/products/${slug}`).then(({ data }) => setProduct(data.product));
  }, [slug]);

  useEffect(() => {
    if (product?._id) {
      api.get(`/products/${product._id}/reviews`).then(({ data }) => setReviews(data.reviews)).catch(() => {});
    }
  }, [product?._id]);

  if (!product) return <div className="min-h-screen bg-ivory flex items-center justify-center text-taupe text-sm">Loading…</div>;

  const selectedVariant = product.variants?.find((v) => v._id === selectedVariantId);
  const basePrice = product.discountPrice ?? product.price;
  const finalPrice = basePrice + (selectedVariant?.priceModifier || 0);
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    setAdding(true);
    try {
      await addItem(product._id, selectedVariantId, quantity);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) return navigate("/login");
    setAdding(true);
    try {
      await addItem(product._id, selectedVariantId, quantity);
      navigate("/checkout");
    } finally {
      setAdding(false);
    }
  };

  const toggleSection = (key) => setOpenSection(openSection === key ? "" : key);

  return (
    <div className="min-h-screen bg-ivory pb-28 safe-top">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-sand flex items-center justify-center">
          <ChevronLeft size={20} className="text-espresso" />
        </button>
        <h1 className="font-display text-lg text-espresso">Product Detail</h1>
        <button
          onClick={() => (user ? toggleWishlist(product._id) : navigate("/login"))}
          className="w-9 h-9 rounded-full bg-sand flex items-center justify-center"
        >
          <Heart size={18} fill={wishlisted ? "#B5622C" : "none"} stroke="#B5622C" strokeWidth={1.75} />
        </button>
      </div>

      {/* Image */}
      <div className="px-5 mt-3">
        <div className="aspect-square bg-sand rounded-3xl overflow-hidden relative">
          {product.images?.[activeImage]?.url && (
            <img src={cldResize(product.images[activeImage].url, 800)} alt={product.name} className="w-full h-full object-cover" />
          )}
          {product.images?.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-ink/60 text-ivory text-xs px-2.5 py-1 rounded-full">
              {activeImage + 1}/{product.images.length}
            </div>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2.5 mt-3 overflow-x-auto no-scrollbar">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 ${i === activeImage ? "border-clay" : "border-transparent"}`}
              >
                <img src={cldResize(img.url, 100)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-5 mt-5">
        <h1 className="font-display text-2xl text-espresso leading-snug">{product.name}</h1>
        {product.ratingsCount > 0 && (
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={product.ratingsAverage} size={15} />
            <span className="text-sm text-taupe">{product.ratingsAverage} ({product.ratingsCount} reviews)</span>
          </div>
        )}
        <p className="text-espresso font-semibold text-2xl mt-2">{formatPrice(finalPrice)}</p>

        {product.variants?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-espresso font-medium mb-2">{product.variants[0].name}</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => setSelectedVariantId(variant._id)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedVariantId === variant._id ? "bg-espresso text-ivory border-espresso" : "border-sand text-espresso"
                  }`}
                >
                  {variant.value}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Accordions */}
        <div className="mt-2">
          <AccordionSection title="Description" isOpen={openSection === "description"} onToggle={() => toggleSection("description")}>
            <p className="text-taupe text-sm leading-relaxed">{product.description}</p>
          </AccordionSection>

          {product.specifications?.length > 0 && (
            <AccordionSection title="Specifications" isOpen={openSection === "specs"} onToggle={() => toggleSection("specs")}>
              <dl className="space-y-2">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <dt className="text-taupe">{spec.key}</dt>
                    <dd className="text-espresso">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </AccordionSection>
          )}

          <AccordionSection title={`Reviews (${reviews.length})`} isOpen={openSection === "reviews"} onToggle={() => toggleSection("reviews")}>
            {reviews.length === 0 ? (
              <p className="text-taupe text-sm">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((r) => (
                  <div key={r._id} className="border-b border-sand pb-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <StarRating rating={r.rating} size={12} />
                      <span className="text-espresso text-sm font-medium">{r.userName}</span>
                    </div>
                    {r.comment && <p className="text-taupe text-sm mt-1">{r.comment}</p>}
                  </div>
                ))}
                <p className="text-xs text-taupe">You can review this product from "My Orders" after delivery.</p>
              </div>
            )}
          </AccordionSection>
        </div>
      </div>

      {/* Sticky bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-ivory border-t border-sand px-5 py-3 flex items-center gap-3 safe-bottom">
        <div className="flex items-center border border-sand rounded-xl">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-10 text-espresso">−</button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} className="w-9 h-10 text-espresso">+</button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
          className="flex-1 border border-espresso text-espresso font-medium rounded-xl py-3 text-sm disabled:opacity-50"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={adding || product.stock === 0}
          className="flex-1 bg-clay text-ivory font-medium rounded-xl py-3 text-sm disabled:opacity-50"
        >
          {product.stock === 0 ? "Out of Stock" : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
