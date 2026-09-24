import BottomNav from "./BottomNav.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-ivory pb-20 safe-top">
    {children}
    <WhatsAppButton />
    <BottomNav />
  </div>
);

export default Layout;