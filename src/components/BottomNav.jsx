import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const BottomNav = () => {
  const { itemCount } = useCart();

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 flex-1 py-2.5 ${isActive ? "text-clay" : "text-taupe"}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-ivory border-t border-sand flex safe-bottom z-40">
      <NavLink to="/" end className={linkClass}>
        <Home size={22} strokeWidth={1.75} />
        <span className="text-[11px] font-medium">Home</span>
      </NavLink>
      <NavLink to="/categories" className={linkClass}>
        <LayoutGrid size={22} strokeWidth={1.75} />
        <span className="text-[11px] font-medium">Categories</span>
      </NavLink>
      <NavLink to="/search" className={linkClass}>
        <Search size={22} strokeWidth={1.75} />
        <span className="text-[11px] font-medium">Search</span>
      </NavLink>
      <NavLink to="/cart" className={linkClass}>
        <div className="relative">
          <ShoppingBag size={22} strokeWidth={1.75} />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-clay text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium">Cart</span>
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <User size={22} strokeWidth={1.75} />
        <span className="text-[11px] font-medium">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
