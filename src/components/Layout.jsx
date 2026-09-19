import BottomNav from "./BottomNav.jsx";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-ivory pb-20 safe-top">
    {children}
    <BottomNav />
  </div>
);

export default Layout;
