import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, ChevronRight, Sofa, Wrench } from "lucide-react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";

const Home = () => {
  const { itemCount } = useCart();
  const [featured, setFeatured] = useState([]);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    api.get("/products", { params: { featured: true, limit: 6 } }).then(({ data }) => setFeatured(data.products)).catch(() => {});
    api.get("/banners", { params: { type: "hero" } }).then(({ data }) => setBanner(data.banners?.[0] || null)).catch(() => {});
  }, []);

  return (
    <Layout>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-espresso flex items-center justify-center">
            <span className="text-ivory font-display text-lg">S</span>
          </div>
          <span className="font-display text-lg text-espresso">Shiva Build Mart</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/search"><Search size={22} className="text-espresso" strokeWidth={1.75} /></Link>
          <Link to="/cart" className="relative">
            <ShoppingBag size={22} className="text-espresso" strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-clay text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Hero banner */}
      <div className="px-5 mt-2">
        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-espresso">
          {banner?.image?.url && (
            <img src={banner.image.url} alt={banner.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <h1 className="font-display text-2xl text-ivory leading-tight max-w-[75%]">
              {banner?.title || "Handcrafted Furniture for a Better Living"}
            </h1>
            <Link
              to={banner?.ctaLink || "/categories"}
              className="inline-block bg-ivory text-espresso text-sm font-medium px-5 py-2.5 rounded-full mt-4 w-fit"
            >
              {banner?.ctaText || "Shop Now"}
            </Link>
          </div>
        </div>
      </div>

      {/* Category shortcuts */}
      <div className="flex gap-3 px-5 mt-5">
        <Link to="/shop?category=furniture" className="flex-1 bg-sand rounded-2xl p-4 flex flex-col items-center gap-2">
          <Sofa size={24} className="text-clay" strokeWidth={1.75} />
          <span className="text-sm font-medium text-espresso">Furniture</span>
        </Link>
        <Link to="/shop?category=hardware" className="flex-1 bg-sand rounded-2xl p-4 flex flex-col items-center gap-2">
          <Wrench size={24} className="text-clay" strokeWidth={1.75} />
          <span className="text-sm font-medium text-espresso">Hardware</span>
        </Link>
      </div>

      {/* Featured products */}
      {featured.length > 0 && (
        <div className="px-5 mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-espresso">Featured Products</h2>
            <Link to="/categories" className="flex items-center text-clay text-sm font-medium">
              See All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
