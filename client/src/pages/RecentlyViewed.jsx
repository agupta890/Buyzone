import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const RecentlyViewed = () => {
  const [recentItems, setRecentItems] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.user) return;
    const items = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentItems(items);
  }, [auth.user]);

  if (!auth.user || recentItems.length === 0) return null;

  return (
    <div className="relative">
      {/* Subtle Scroll Hint Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FBFBFB] to-transparent z-10 pointer-events-none"></div>

      {/* Horizontal Scroll Area */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 -mx-2 px-2">
        {recentItems.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            className="group min-w-[180px] max-w-[180px] bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0 flex flex-col overflow-hidden"
          >
            {/* Image Container */}
            <div className="w-full h-40 flex items-center justify-center bg-gray-50 p-6 relative">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Info */}
            <div className="p-4 bg-white flex-1 flex flex-col justify-center">
              <p className="text-gray-900 text-sm font-bold group-hover:text-amber-600 transition-colors line-clamp-2">
                {item.name}
              </p>
              <div className="mt-2 flex items-center justify-between">
                 <span className="text-amber-500 font-black text-xs">VIEW DETAIL</span>
                 <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
