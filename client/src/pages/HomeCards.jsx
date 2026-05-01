import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { categories } from "../data/categories";

const HomeCardGrid = () => {
  // Convert categories object to an array for easier mapping
  const categoryEntries = Object.entries(categories).slice(0, 4); // Show first 4 on home

  return (
    <section className="py-16 sm:py-28 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-16 sm:mb-24 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="h-[2px] w-8 bg-amber-500 rounded-full"></span>
          <span className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
            Discovery
          </span>
          <span className="h-[2px] w-8 bg-amber-500 rounded-full"></span>
        </div>
        <h2 className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tight leading-none">
          The <span className="text-amber-500">Edit</span>
        </h2>
        <p className="text-gray-500 text-sm sm:text-xl max-w-xl mx-auto font-medium leading-relaxed">
          Carefully selected collections for those who appreciate the finer details in life.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
        {categoryEntries.map(([slug, card], index) => (
          <Link
            key={slug}
            to={`/category/${slug}`}
            className="group block relative"
          >
            {/* Card Body */}
            <div className="relative aspect-[3/4] rounded-[2.5rem] bg-gray-100 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-4">
              {/* Image with subtle zoom and shift */}
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
              />
              
              {/* Refined Glassmorphism Info Box */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-xl transform transition-all duration-500 group-hover:bg-white">
                  <span className="block text-amber-600 text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">
                    {card.subtitle}
                  </span>
                  <h3 className="text-slate-900 text-xl font-black tracking-tight flex items-center justify-between">
                    {card.title}
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center -mr-2 transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                      <ArrowUpRight size={16} />
                    </div>
                  </h3>
                </div>
              </div>
            </div>

            {/* Decorative Number (Background) */}
            <span className="absolute -top-4 -left-4 text-8xl font-black text-slate-900/5 select-none transition-colors group-hover:text-amber-500/10">
              0{index + 1}
            </span>
          </Link>
        ))}
      </div>


      {/* Footer Link */}
      <div className="mt-16 sm:mt-24 text-center">
        <Link 
          to="/shop-all" 
          className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-full font-black hover:bg-amber-500 transition-all shadow-xl hover:shadow-amber-500/20 transform hover:scale-105 active:scale-95 group"
        >
          View All Collections
          <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
            <ArrowUpRight size={20} />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default HomeCardGrid;
