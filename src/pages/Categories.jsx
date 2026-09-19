import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Sofa, Wrench } from "lucide-react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";

const Categories = () => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    api.get("/products/subcategories").then(({ data }) => setSubCategories(data.subCategories)).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <h1 className="font-display text-xl text-espresso">Categories</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 px-5 mt-3">
        <Link to="/shop?category=furniture" className="bg-sand rounded-2xl p-5 flex flex-col items-center gap-3 aspect-square justify-center">
          <Sofa size={32} className="text-clay" strokeWidth={1.5} />
          <span className="font-medium text-espresso">Furniture</span>
        </Link>
        <Link to="/shop?category=hardware" className="bg-sand rounded-2xl p-5 flex flex-col items-center gap-3 aspect-square justify-center">
          <Wrench size={32} className="text-clay" strokeWidth={1.5} />
          <span className="font-medium text-espresso">Hardware</span>
        </Link>
      </div>

      {subCategories.length > 0 && (
        <div className="px-5 mt-8">
          <h2 className="font-display text-lg text-espresso mb-3">Popular</h2>
          <div className="grid grid-cols-3 gap-3">
            {subCategories.map((sub) => (
              <Link
                key={sub}
                to={`/shop?subCategories=${encodeURIComponent(sub)}`}
                className="bg-ivory border border-sand rounded-xl py-4 text-center text-sm text-espresso font-medium"
              >
                {sub}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Categories;
