import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, CreditCard, Heart, HelpCircle, Info, Settings, ChevronRight, User, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";

const menuItems = [
  { icon: Package, label: "My Orders", path: "/orders" },
  { icon: MapPin, label: "Address Book", path: "/addresses" },
  { icon: CreditCard, label: "Payment Methods", path: "/payment-methods" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: HelpCircle, label: "Help & Support", path: "/help" },
  { icon: Info, label: "About Us", path: "/about" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loyaltyBalance, setLoyaltyBalance] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get("/auth/loyalty").then(({ data }) => setLoyaltyBalance(data.balance)).catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <User className="text-taupe mb-3" size={40} strokeWidth={1.5} />
          <p className="text-taupe text-sm mb-4">Log in to see your profile, orders, and more.</p>
          <button onClick={() => navigate("/login")} className="bg-espresso text-ivory px-6 py-2.5 rounded-full text-sm font-medium">
            Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white px-5 pt-6 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center">
            <span className="text-espresso font-display text-lg">{user.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-espresso font-semibold text-[15px]">{user.name}</p>
            <p className="text-taupe text-sm">{user.email}</p>
          </div>
        </div>
        <button onClick={() => navigate("/settings")}><Settings size={20} className="text-taupe" /></button>
      </div>

      {loyaltyBalance !== null && (
        <div className="px-4 mt-4">
          <div className="bg-espresso rounded-2xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles size={20} className="text-clay" />
              <div>
                <p className="text-ivory/70 text-xs">Reward Points</p>
                <p className="text-ivory font-display text-xl">{loyaltyBalance}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl divide-y divide-sand">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-4"
            >
              <item.icon size={19} className="text-clay" strokeWidth={1.75} />
              <span className="flex-1 text-left text-espresso text-sm font-medium">{item.label}</span>
              <ChevronRight size={18} className="text-taupe" />
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;