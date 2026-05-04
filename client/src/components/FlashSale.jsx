import { useState, useEffect } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-amber-500 py-3 sm:py-4 px-4 overflow-hidden relative group">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-black relative z-10">
        <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-sm sm:text-lg italic">
          <Zap size={20} className="fill-current animate-pulse" />
          <span>Flash Sale is Live</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {[
              { label: 'HRS', value: timeLeft.hours },
              { label: 'MIN', value: timeLeft.minutes },
              { label: 'SEC', value: timeLeft.seconds },
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-black text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg text-lg sm:text-xl font-black shadow-lg transform group-hover:scale-110 transition-transform">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <span className="text-[8px] sm:text-[10px] font-bold mt-1 opacity-70">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="hidden md:block text-sm font-bold opacity-80 uppercase tracking-widest">
            Up to 70% Off on everything!
          </p>
          <Link 
            to="/shop-all" 
            className="bg-black text-white px-6 py-2 rounded-full text-xs sm:text-sm font-black flex items-center gap-2 hover:bg-white hover:text-black transition-all shadow-xl"
          >
            Claim Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

export default FlashSale;
