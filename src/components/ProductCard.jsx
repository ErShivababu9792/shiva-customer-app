import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { cldResize } from "../utils/image.js";
import StarRating from "./StarRating.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const price = product.discountPrice ?? product.price;
  const wishlisted = isWishlisted(product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    toggleWishlist(product._id);
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (product.variants?.length > 0) return navigate(`/product/${product.slug}`);
    await addItem(product._id, null, 1);
  };

  return (
    <Link to={`/product/${product.slug}`} className="block">
      <div className="relative aspect-square bg-sand rounded-2xl overflow-hidden">
        {product.images?.[0]?.url ? (
          <img src={cldResize(product.images[0].url, 400)} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-taupe text-xs">No image</div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-ivory/90 flex items-center justify-center"
        >
          <Heart size={15} fill={wishlisted ? "#B5622C" : "none"} stroke="#B5622C" strokeWidth={1.75} />
        </button>
      </div>
      <div className="mt-2">
        <h3 className="text-espresso text-sm font-medium leading-snug line-clamp-1">{product.name}</h3>
        {product.ratingsCount > 0 && (
          <div className="mt-0.5">
            <StarRating rating={product.ratingsAverage} showCount count={product.ratingsCount} size={11} />
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-espresso font-semibold text-[15px]">{formatPrice(price)}</span>
          <button onClick={handleQuickAdd} className="w-8 h-8 rounded-lg bg-clay flex items-center justify-center shrink-0">
            <ShoppingBag size={15} className="text-ivory" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
