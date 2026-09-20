import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const refresh = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart);
    } catch {
      setCart({ items: [] });
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId, variantId, quantity = 1) => {
    const { data } = await api.post("/cart/items", { productId, variantId, quantity });
    setCart(data.cart);
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    setCart(data.cart);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    setCart(data.cart);
  };

  const clearCart = async () => {
    setCart({ items: [] });
  };

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, addItem, updateItem, removeItem, clearCart, refresh }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);