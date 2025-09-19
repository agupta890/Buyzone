import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const RecentlyViewed = () => {
  const [recentItems, setRecentItems] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.user) return; // ✅ Only load for logged-in users
    const items = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentItems(items);
  }, [auth.user]); // re-check if user changes

  if (!auth.user || recentItems.length === 0) return null; // ✅ conditional render AFTER effect

  return (
    <section className="py-10 bg-gray-700 px-4 sm:px-6 lg:px-12">
      <h2 className="text-2xl text-amber-500 md:text-3xl lg:text-4xl font-bold text-center mb-6">
        Recently Viewed
      </h2>

      {/* Scrollable Container */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
        {recentItems.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            className="min-w-[150px] max-w-[150px] bg-gray-200 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 flex-shrink-0"
          >
            <div className="w-full h-28 flex items-center justify-center bg-white rounded-t-lg">
              <img
                src={item.image}
                alt={item.name}
                className="max-h-24 object-contain p-2"
              />
            </div>
            <p className="text-gray-800 text-sm font-medium text-center py-2 truncate">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
