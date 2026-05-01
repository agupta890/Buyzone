import { useState, useEffect, useRef } from "react";
import HomeCardGrid from "./HomeCards";
import { 
  ArrowLeft, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones,
  ShoppingBag,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

// Import your slider images
import img3 from "../assets/slide3.jpg";
import img1 from "../assets/slide1.jpg";
import img2 from "../assets/slide2.jpg";
import img4 from "../assets/slide4.jpg";
import img5 from "../assets/slide5.jpg";

const images = [img1, img2, img3, img4, img5];

const featureImg = "https://res.cloudinary.com/project01/image/upload/v1757774635/rgirblwu1mv1rh89xqgl.jpg";

// ✅ Custom Hook for Scroll Reveal
const useReveal = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

export const HomePage = () => {
  const [current, setCurrent] = useState(0);
  const [uspRef, uspVisible] = useReveal();
  const [categoriesRef, categoriesVisible] = useReveal();
  const [promoRef, promoVisible] = useReveal();
  const [newsletterRef, newsletterVisible] = useReveal();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const goToNext = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="bg-[#FBFBFB] min-h-screen font-sans text-[#1A1A1A] overflow-x-hidden">
      
      {/* 1. Hero Section - Animated Entry */}
      <section className="relative group animate-fade-in">
        <div className="max-w-[1400px] mx-auto px-4 pt-4 sm:pt-6">
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl transition-all duration-700 hover:shadow-amber-500/10">
            <div
              className="flex w-full h-full transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((img, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent sm:from-black/40 sm:via-transparent sm:to-transparent"></div>
                  
                  {/* Content with per-slide animation */}
                  <div className={`absolute top-1/2 left-6 sm:left-16 -translate-y-1/2 text-white max-w-[85%] sm:max-w-lg space-y-3 sm:space-y-5 transition-all duration-1000 ${current === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                    <span className="inline-block bg-amber-500 text-black text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-bounce">
                      New Arrival
                    </span>
                    <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black leading-tight drop-shadow-2xl">
                      Discover Your <br />
                      <span className="text-amber-400">Perfect Style</span>
                    </h2>
                    <p className="text-gray-200 text-sm sm:text-lg lg:text-xl line-clamp-2 sm:line-clamp-none drop-shadow-md">
                      Exclusive collections curated for your premium lifestyle. 
                      Limited edition items now available.
                    </p>
                    <div className="pt-2 sm:pt-4">
                      <Link to="/shop-all" className="inline-flex items-center gap-2 bg-white text-black px-6 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base font-black hover:bg-amber-400 transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                        Explore Now <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={goToPrev}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black p-3 sm:p-4 rounded-full backdrop-blur-md hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black p-3 sm:p-4 rounded-full backdrop-blur-md hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
            >
              <ArrowRight size={24} />
            </button>

            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1 sm:h-1.5 transition-all duration-500 rounded-full shadow-lg ${
                    idx === current ? "w-6 sm:w-10 bg-amber-400" : "w-3 sm:w-5 bg-white/40"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. USP Section - Animated Reveal */}
      <section 
        ref={uspRef} 
        className={`max-w-7xl mx-auto px-6 py-10 sm:py-20 transition-all duration-1000 ${uspVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {[
            { icon: <Truck className="text-amber-500" />, title: "Free Shipping", desc: "On orders above ₹999" },
            { icon: <ShieldCheck className="text-amber-500" />, title: "Secure Payment", desc: "100% Protected transactions" },
            { icon: <RotateCcw className="text-amber-500" />, title: "Easy Returns", desc: "7 Days hassle-free return" },
            { icon: <Headphones className="text-amber-500" />, title: "24/7 Support", desc: "Dedicated support team" },
          ].map((item, i) => (
            <div 
              key={i} 
              className="flex sm:flex-col items-center sm:text-center p-5 sm:p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-50 group hover:-translate-y-2"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-0 sm:mb-5 bg-amber-50 p-4 rounded-2xl group-hover:bg-amber-100 transition-colors mr-4 sm:mr-0">{item.icon}</div>
              <div>
                <h4 className="font-black text-slate-900 text-base sm:text-lg">{item.title}</h4>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <div 
        ref={categoriesRef} 
        className={`bg-white transition-all duration-1000 ${categoriesVisible ? "opacity-100" : "opacity-0"}`}
      >
        <HomeCardGrid />
      </div>

      {/* 4. Promotional Banner - Animated Reveal */}
      <section 
        ref={promoRef} 
        className={`max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24 transition-all duration-1000 ${promoVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="relative min-h-[450px] sm:h-[500px] lg:h-[600px] rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden group shadow-2xl">
          <img
            src={featureImg}
            alt="Flash Sale"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[3000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 sm:bg-black/30 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 py-12">
            <div className="bg-amber-500 text-black text-[10px] sm:text-xs font-black px-4 sm:px-6 py-2 rounded-full mb-6 sm:mb-8 animate-bounce shadow-2xl">
              LIMITED TIME OFFER
            </div>
            <h2 className={`text-white text-4xl sm:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 drop-shadow-2xl uppercase tracking-tighter leading-none transition-all duration-1000 delay-300 ${promoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              Mid-Season <br className="sm:hidden" /><span className="text-amber-400">Mega Sale</span>
            </h2>
            <p className={`text-gray-200 text-sm sm:text-xl lg:text-2xl max-w-2xl mb-10 sm:mb-12 drop-shadow-lg leading-relaxed transition-all duration-1000 delay-500 ${promoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              Unlock up to <span className="text-white font-black text-2xl sm:text-4xl">70% OFF</span> on premium home decor and lifestyle essentials. Your dream home is one click away.
            </p>
            <div className={`flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 sm:px-0 transition-all duration-1000 delay-700 ${promoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
               <Link to="/shop-all" className="bg-white text-black px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-2xl transform hover:scale-105 active:scale-95">
                 Shop the Sale <Zap size={22} className="fill-current" />
               </Link>
               <Link to="/bestseller" className="bg-transparent border-2 border-white text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black hover:bg-white hover:text-black transition-all backdrop-blur-sm">
                 View Bestsellers
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newsletter / Trust Section - Animated Reveal */}
      <section 
        ref={newsletterRef}
        className={`bg-slate-950 py-16 sm:py-28 px-6 relative overflow-hidden transition-all duration-1000 ${newsletterVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] -mr-[150px] -mt-[150px]"></div>
        
        <div className={`max-w-4xl mx-auto text-center space-y-6 sm:space-y-10 relative z-10 transition-all duration-1000 delay-300 ${newsletterVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
           <div className="inline-block bg-amber-500/10 p-5 rounded-[2rem] mb-4">
             <ShoppingBag size={40} className="text-amber-500 sm:w-[60px] sm:h-[60px] animate-pulse" />
           </div>
           <h2 className="text-white text-3xl sm:text-6xl font-black tracking-tight">Join the <span className="text-amber-500">BuyZone</span> Community</h2>
           <p className="text-gray-400 text-sm sm:text-xl max-w-2xl mx-auto leading-relaxed">
             Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals delivered straight to your inbox.
           </p>
           <form className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
             <input 
               type="email" 
               placeholder="Enter your email address" 
               className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 sm:py-5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm sm:text-base"
             />
             <button className="bg-amber-500 text-black px-10 py-4 sm:py-5 rounded-full font-black hover:bg-amber-400 transition-all shadow-xl transform hover:scale-105 active:scale-95">
               Subscribe Now
             </button>
           </form>
           <p className="text-gray-500 text-[10px] sm:text-xs pt-4 uppercase tracking-[0.2em] font-bold opacity-60">
             By subscribing, you agree to our Terms of Service
           </p>
        </div>
      </section>

    </div>
  );
};
