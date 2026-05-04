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
  Zap,
  Star,
  Quote,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

// New Components
import FlashSale from "../components/FlashSale";
import TrendingSection from "../components/TrendingSection";
import WelcomePopup from "../components/WelcomePopup";

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [uspRef, uspVisible] = useReveal();
  const [categoriesRef, categoriesVisible] = useReveal();
  const [promoRef, promoVisible] = useReveal();
  const [newsletterRef, newsletterVisible] = useReveal();
  const [testimonialsRef, testimonialsVisible] = useReveal();
  const [trendingRef, trendingVisible] = useReveal();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); 
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 1000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const goToPrev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const goToNext = () => setCurrent((prev) => (prev + 1) % images.length);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#FBFBFB] min-h-screen font-sans text-[#1A1A1A] overflow-x-hidden">
      <WelcomePopup />
      <FlashSale />
      
      {/* 1. Hero Section - Animated Entry */}
      <section className="relative group animate-fade-in">
        <div className="max-w-[1400px] mx-auto px-4 pt-4 sm:pt-6">
          <div className="relative h-[400px] sm:h-[500px] lg:h-[700px] overflow-hidden rounded-[1.5rem] sm:rounded-[3rem] shadow-2xl transition-all duration-700 hover:shadow-amber-500/10">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
                  
                  {/* Content with per-slide animation */}
                  <div className={`absolute top-1/2 left-6 sm:left-20 -translate-y-1/2 text-white max-w-[85%] sm:max-w-2xl space-y-4 sm:space-y-8 transition-all duration-1000 ${current === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                    <div className="inline-flex items-center gap-2 bg-amber-500 text-black text-[10px] sm:text-xs font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg animate-pulse">
                      <Sparkles size={14} /> Seasonal Collection
                    </div>
                    <h2 className="text-4xl sm:text-7xl lg:text-9xl font-black leading-[0.9] drop-shadow-2xl tracking-tighter">
                      Elevate Your <br />
                      <span className="text-amber-400 italic">Everyday.</span>
                    </h2>
                    <p className="text-gray-200 text-sm sm:text-xl lg:text-2xl line-clamp-2 sm:line-clamp-none drop-shadow-md font-medium max-w-xl">
                      Experience the perfect blend of artisan craftsmanship and modern aesthetics.
                    </p>
                    <div className="pt-4 sm:pt-6 flex flex-wrap gap-4">
                      <Link to="/shop-all" className="inline-flex items-center gap-3 bg-white text-black px-8 sm:px-12 py-4 sm:py-5 rounded-full text-sm sm:text-lg font-black hover:bg-amber-400 transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
                        Shop Now <ArrowRight size={22} />
                      </Link>
                      <Link to="/categories" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-sm sm:text-lg font-black hover:bg-white hover:text-black transition-all">
                        Categories
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={goToPrev}
              className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-black p-4 sm:p-5 rounded-full backdrop-blur-md hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/20"
            >
              <ArrowLeft size={28} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-black p-4 sm:p-5 rounded-full backdrop-blur-md hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/20"
            >
              <ArrowRight size={28} />
            </button>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 transition-all duration-700 rounded-full ${
                    idx === current ? "w-12 sm:w-20 bg-amber-400" : "w-4 sm:w-6 bg-white/30 hover:bg-white/50"
                  }`}
                ></button>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 right-10 hidden lg:flex flex-col items-center gap-4 text-white/50">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] rotate-90 mb-8">Scroll</span>
               <div className="w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. USP Section - Animated Reveal */}
      <section 
        ref={uspRef} 
        className={`max-w-7xl mx-auto px-6 py-16 sm:py-32 transition-all duration-1000 ${uspVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {[
            { icon: <Truck className="text-amber-500" size={32} />, title: "Express Delivery", desc: "Across India in 3-5 days" },
            { icon: <ShieldCheck className="text-amber-500" size={32} />, title: "Secure Checkout", desc: "Encrypted & safe payments" },
            { icon: <RotateCcw className="text-amber-500" size={32} />, title: "Flexible Returns", desc: "Easy 7-day return policy" },
            { icon: <Headphones className="text-amber-500" size={32} />, title: "Expert Support", desc: "Available for you 24/7" },
          ].map((item, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center text-center p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-gray-100 group hover:-translate-y-3"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-6 bg-amber-50 p-6 rounded-[2rem] group-hover:bg-amber-100 transition-colors transform group-hover:rotate-12 duration-500">{item.icon}</div>
              <div>
                <h4 className="font-black text-slate-900 text-xl mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Trending Section */}
      <div ref={trendingRef} className={`transition-all duration-1000 ${trendingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <TrendingSection />
      </div>

      {/* 4. Featured Categories Grid */}
      <div 
        ref={categoriesRef} 
        className={`bg-white transition-all duration-1000 ${categoriesVisible ? "opacity-100" : "opacity-0"}`}
      >
        <HomeCardGrid />
      </div>

      {/* 5. Promotional Banner - Animated Reveal */}
      <section 
        ref={promoRef} 
        className={`max-w-[1400px] mx-auto px-4 sm:px-6 py-16 sm:py-32 transition-all duration-1000 ${promoVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="relative min-h-[500px] sm:h-[600px] lg:h-[750px] rounded-[3rem] sm:rounded-[4rem] overflow-hidden group shadow-2xl">
          <img
            src={featureImg}
            alt="Flash Sale"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[4000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 py-12">
            <div className="bg-amber-500 text-black text-xs font-black px-8 py-3 rounded-full mb-8 animate-bounce shadow-2xl tracking-widest uppercase">
              Limited Time Extravaganza
            </div>
            <h2 className={`text-white text-5xl sm:text-8xl lg:text-[10rem] font-black mb-6 drop-shadow-2xl uppercase tracking-tighter leading-[0.85] transition-all duration-1000 delay-300 ${promoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              Mid-Season <br /><span className="text-amber-400 italic">Mega Sale</span>
            </h2>
            <p className={`text-gray-200 text-base sm:text-2xl lg:text-3xl max-w-3xl mb-12 drop-shadow-lg leading-relaxed font-medium transition-all duration-1000 delay-500 ${promoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              Unlock up to <span className="text-white font-black text-4xl sm:text-6xl underline decoration-amber-500 decoration-8 underline-offset-8">70% OFF</span> on premium essentials. 
            </p>
            <div className={`flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto px-4 sm:px-0 transition-all duration-1000 delay-700 ${promoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
               <Link to="/shop-all" className="bg-white text-black px-12 sm:px-16 py-5 sm:py-6 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-2xl transform hover:scale-105 active:scale-95">
                 Shop the Sale <Zap size={24} className="fill-current" />
               </Link>
               <Link to="/bestseller" className="bg-transparent border-2 border-white/50 text-white px-12 sm:px-16 py-5 sm:py-6 rounded-full font-black text-lg hover:bg-white hover:text-black transition-all backdrop-blur-md">
                 Bestsellers
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className={`max-w-7xl mx-auto px-6 py-20 sm:py-32 transition-all duration-1000 ${testimonialsVisible ? "opacity-100" : "opacity-0 translate-y-10"}`}
      >
        <div className="text-center mb-16 sm:mb-24 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-[2px] w-8 bg-amber-500 rounded-full"></span>
            <span className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
              Voices of BuyZone
            </span>
            <span className="h-[2px] w-8 bg-amber-500 rounded-full"></span>
          </div>
          <h2 className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tight leading-none">
            What Our <span className="text-amber-500 italic">Community</span> Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Priya Sharma", role: "Home Decor Enthusiast", text: "The quality of the bedsheets I ordered surpassed all my expectations. BuyZone is now my go-to for home essentials!", rating: 5, avatar: "PS" },
            { name: "Rahul Verma", role: "Frequent Shopper", text: "Incredible selection and lightning-fast delivery. The 'Mega Sale' deals are actually legitimate. Highly recommend!", rating: 5, avatar: "RV" },
            { name: "Ananya Iyer", role: "Premium Member", text: "Customer support is top-notch. I had a query about my order and it was resolved within minutes. Truly a premium experience.", rating: 5, avatar: "AI" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
               <Quote className="absolute -top-4 -right-4 w-24 h-24 text-amber-500/5 group-hover:text-amber-500/10 transition-colors" />
               <div className="flex gap-1 mb-6">
                 {[...Array(item.rating)].map((_, i) => <Star key={i} size={16} className="fill-amber-500 text-amber-500" />)}
               </div>
               <p className="text-slate-700 text-lg font-medium leading-relaxed mb-8 italic">
                 "{item.text}"
               </p>
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-amber-500 text-black flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-amber-500/20">
                    {item.avatar}
                 </div>
                 <div>
                   <h5 className="font-black text-slate-900">{item.name}</h5>
                   <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.role}</p>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Newsletter / Trust Section - Animated Reveal */}
      <section 
        ref={newsletterRef}
        className={`bg-slate-950 py-20 sm:py-40 px-6 relative overflow-hidden transition-all duration-1000 ${newsletterVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -mr-[250px] -mt-[250px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] -ml-[250px] -mb-[250px]"></div>
        
        <div className={`max-w-5xl mx-auto text-center space-y-8 sm:space-y-12 relative z-10 transition-all duration-1000 delay-300 ${newsletterVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
           <div className="inline-block bg-amber-500/10 p-8 rounded-[3rem] mb-4 border border-amber-500/20">
             <ShoppingBag size={60} className="text-amber-500 sm:w-[80px] sm:h-[80px] animate-pulse" />
           </div>
           <h2 className="text-white text-4xl sm:text-8xl font-black tracking-tighter leading-none">
             Join the <span className="text-amber-500 italic underline decoration-amber-500 decoration-4 underline-offset-8">BuyZone</span> Inner Circle
           </h2>
           <p className="text-gray-400 text-base sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
             Subscribe for exclusive early access to drops, secret sale codes, and curated lifestyle inspiration.
           </p>
           <form className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto pt-8" onSubmit={(e) => e.preventDefault()}>
             <input 
               type="email" 
               placeholder="Your premium email address" 
               className="flex-1 bg-white/5 border border-white/10 rounded-full px-10 py-5 sm:py-6 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base sm:text-lg backdrop-blur-md"
             />
             <button className="bg-amber-500 text-black px-12 py-5 sm:py-6 rounded-full font-black text-lg hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20 transform hover:scale-105 active:scale-95">
               Join Now
             </button>
           </form>
           <div className="flex flex-wrap justify-center gap-8 pt-12 opacity-40">
              {["Free Shipping", "Secure Checkout", "24/7 Support", "Genuine Products"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.3em]">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  {item}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[60] bg-amber-500 text-black p-4 rounded-2xl shadow-2xl hover:bg-black hover:text-white transition-all transform hover:-translate-y-2 animate-in slide-in-from-bottom-10"
        >
          <ChevronUp size={24} />
        </button>
      )}

    </div>
  );
};

