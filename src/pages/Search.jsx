import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search as SearchIcon } from "lucide-react";
import Layout from "../components/Layout.jsx";

const Search = () => {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
  };

  return (
    <Layout>
      <div className="flex items-center gap-3 px-5 pt-4">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 bg-sand rounded-full px-4 py-2.5">
          <SearchIcon size={18} className="text-taupe" />
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products…"
            className="flex-1 bg-transparent text-sm outline-none text-espresso placeholder:text-taupe"
          />
        </form>
      </div>
      <p className="text-taupe text-sm text-center mt-16 px-8">Search for furniture, hardware, or anything else you're looking for.</p>
    </Layout>
  );
};

export default Search;
