import { Star } from "lucide-react";

const StarRating = ({ rating = 0, size = 13, showCount, count = 0 }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? "#B5622C" : "none"} stroke="#B5622C" strokeWidth={1.5} />
      ))}
    </div>
    {showCount && <span className="text-xs text-taupe">({count})</span>}
  </div>
);

export default StarRating;
