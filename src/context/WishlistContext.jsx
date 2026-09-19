import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    try {
      const { data } = await api.get("/auth/wishlist");
      setWishlistIds(data.products.map((p) => p._id));
    } catch {
      setWishlistIds([]);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isWishlisted = (productId) => wishlistIds.includes(productId);

  const toggleWishlist = async (productId) => {
    const { data } = await api.post(`/auth/wishlist/${productId}`);
    setWishlistIds(data.wishlist);
    return data.wishlisted;
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, isWishlisted, toggleWishlist, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
