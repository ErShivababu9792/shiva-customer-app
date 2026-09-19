import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Search, ShoppingBag } from "lucide-react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const category = searchParams.get("category") || "";
  const activeSub = searchParams.get("subCategories") || "";
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (category) {
      api.get("/products/subcategories", { params: { category } }).then(({ data }) => setSubCategories(data.subCategories)).catch(() => {});
    }
  }, [category]);

  // Reset to page 1 whenever the filters change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    api
      .get("/products", {
        params: { category: category || undefined, subCategories: activeSub || undefined, search: search || undefined, limit: 12, page: 1 },
      })
      .then(({ data }) => {
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
      })
      .finally(() => setLoading(false));
  }, [category, activeSub, search]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const { data } = await api.get("/products", {
        params: { category: category || undefined, subCategories: activeSub || undefined, search: search || undefined, limit: 12, page: nextPage },
      });
      setProducts((prev) => [...prev, ...data.products]);
      setPage(nextPage);
      setTotalPages(data.pagination.pages);
    } finally {
      setLoadingMore(false);
    }
  };

  const selectSub = (sub) => {
    const params = new URLSearchParams(searchParams);
    if (sub) params.set("subCategories", sub);
    else params.delete("subCategories");
    setSearchParams(params);
  };

  const title = category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products";

  return (
    <Layout>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
          <h1 className="font-display text-xl text-espresso">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/search")}><Search size={22} className="text-espresso" strokeWidth={1.75} /></button>
          <button onClick={() => navigate("/cart")} className="relative">
            <ShoppingBag size={22} className="text-espresso" strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-clay text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {subCategories.length > 0 && (
        <div className="flex gap-2 px-5 mt-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => selectSub("")}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${!activeSub ? "bg-clay text-ivory" : "bg-sand text-espresso"}`}
          >
            All
          </button>
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => selectSub(sub)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${activeSub === sub ? "bg-clay text-ivory" : "bg-sand text-espresso"}`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <div className="px-5 mt-4">
        {loading ? (
          <p className="text-taupe text-sm text-center py-16">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-taupe text-sm text-center py-16">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {page < totalPages && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full border border-espresso text-espresso font-medium rounded-xl py-3 text-sm mt-6 mb-4 disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load More"}
              </button>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Shop;