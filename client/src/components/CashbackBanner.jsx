import { useState, useEffect } from "react";
import { Gift, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CashbackBanner = () => {
  const [offer, setOffer] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cashback-offer`);
        const data = await res.json();
        setOffer(data);
      } catch (err) {
        console.error("Failed to fetch cashback offer:", err);
      }
    };
    fetchOffer();
  }, [pathname]);

  if (!offer || !offer.isActive || pathname.startsWith("/admin")) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white py-3 px-4 text-center text-xs sm:text-sm font-bold relative overflow-hidden flex flex-wrap items-center justify-center gap-2 shadow-md">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
      <span className="inline-flex items-center justify-center bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
        Coins Offer
      </span>
      <span className="drop-shadow-sm font-black tracking-tight">{offer.bannerText}</span>
      <Link to="/shop-all" className="underline hover:text-amber-400 transition-colors ml-1 font-black text-[11px] uppercase tracking-widest flex items-center gap-0.5">
        Shop Now <ArrowRight size={12} className="inline" />
      </Link>
    </div>
  );
};

export default CashbackBanner;
