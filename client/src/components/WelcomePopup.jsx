import { useState, useEffect } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500 delay-200">
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-6 right-6 z-10 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col">
          {/* Header Image/Pattern */}
          <div className="h-48 bg-amber-500 relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                  <Sparkles 
                    key={i} 
                    className="absolute text-white" 
                    size={Math.random() * 20 + 10}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 360}deg)`
                    }}
                  />
                ))}
             </div>
             <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl transform -rotate-6 animate-bounce">
                <Gift size={60} className="text-amber-500" />
             </div>
          </div>

          {/* Content */}
          <div className="p-10 text-center space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Welcome to <span className="text-amber-500">BuyZone</span>
              </h2>
              <p className="text-gray-500 font-medium">
                Unlock your first exclusive reward!
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-dashed border-amber-200 p-6 rounded-[2rem]">
               <span className="block text-amber-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Your Special Code</span>
               <div className="text-3xl font-black text-slate-900 tracking-widest">
                 WELCOME20
               </div>
               <p className="text-xs text-amber-700 mt-2 font-bold">
                 Get 20% OFF on your first purchase
               </p>
            </div>

            <button 
              onClick={closePopup}
              className="w-full bg-slate-900 text-white py-5 rounded-full font-black text-lg hover:bg-amber-500 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20"
            >
              Start Shopping
            </button>

            <button 
              onClick={closePopup}
              className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
