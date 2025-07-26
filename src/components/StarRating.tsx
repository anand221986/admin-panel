import { Star } from "lucide-react";

export default function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500">by anand gupta (You)</span>
    </div>
  );
}
