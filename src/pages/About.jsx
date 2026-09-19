import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory pb-10 safe-top">
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} className="text-espresso" /></button>
        <h1 className="font-display text-xl text-espresso">About Us</h1>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl p-5">
          <h2 className="font-display text-lg text-espresso mb-2">Shiva Build Mart</h2>
          <p className="text-taupe text-sm leading-relaxed">
            We design and build furniture in-house, alongside a curated range of quality hardware essentials.
            Every piece is chosen or crafted to last well past the trend cycle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
