import { Link } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

const FEATURES = [
  { icon: Truck, title: "Free & fast delivery", desc: "On every order, right to your door." },
  { icon: ShieldCheck, title: "Secure checkout", desc: "Your data is encrypted end to end." },
  { icon: RotateCcw, title: "Hassle-free returns", desc: "Changed your mind? Send it back easily." },
];

// Shared split-screen shell for the Login & Register pages.
// Left: branded marketing panel (desktop only). Right: the form (passed as children).
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left brand panel (desktop) ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-slate-900 text-white p-12 xl:p-16 flex-col justify-between">
        {/* Decorative glows + grid */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Logo */}
        <Link to="/" className="relative z-10 inline-flex items-center text-2xl font-black tracking-tight">
          Buy<span className="text-amber-500">Zone</span>
        </Link>

        {/* Headline + features */}
        <div className="relative z-10 space-y-10 max-w-md">
          <div className="space-y-4">
            <span className="inline-block bg-amber-500/15 text-amber-400 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full">
              Premium Shopping
            </span>
            <h1 className="text-4xl xl:text-5xl font-black leading-[1.05] tracking-tight">
              Everything you love,{" "}
              <span className="text-amber-500">delivered with care.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              Join thousands of happy shoppers and unlock exclusive deals, faster checkout, and order tracking.
            </p>
          </div>

          <ul className="space-y-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="text-amber-500" size={20} />
                </div>
                <div>
                  <p className="font-bold text-white">{title}</p>
                  <p className="text-sm text-slate-400 font-medium">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} BuyZone. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            to="/"
            className="lg:hidden flex items-center justify-center text-2xl font-black tracking-tight text-slate-900 mb-10"
          >
            Buy<span className="text-amber-500">Zone</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
