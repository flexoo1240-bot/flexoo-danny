import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Zap, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const BuyCode = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-background pb-8">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-buycode" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(150, 20%, 40%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-buycode)" />
        </svg>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-primary/6 blur-[120px]" />

      {/* Floating particles */}
      {[
        { top: "12%", left: "8%", delay: "0s", size: "w-1.5 h-1.5" },
        { top: "55%", right: "15%", delay: "2s", size: "w-1 h-1" },
        { top: "75%", left: "50%", delay: "3s", size: "w-1.5 h-1.5" },
        { top: "30%", right: "5%", delay: "1s", size: "w-1 h-1" },
        { top: "85%", left: "20%", delay: "4s", size: "w-1 h-1" },
      ].map((p, i) => (
        <div
          key={i}
          className={`particle absolute ${p.size} rounded-full bg-primary/30`}
          style={{ top: p.top, left: p.left, right: (p as any).right, animationDelay: p.delay }}
        />
      ))}

      <div className="relative z-10 max-w-md mx-auto px-4 pt-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3 mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-secondary/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-11 h-11 rounded-full bg-[#F5C518] flex items-center justify-center shadow-lg shadow-[#F5C518]/10">
            <ShoppingCart className="w-5 h-5 text-background" />
          </div>
          <p className="text-[15px] font-bold text-foreground tracking-tight">Buy Withdrawal Code</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            /* Loading State */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="flex flex-col items-center justify-center pt-20"
            >
              {/* Spinning ring with icon */}
              <div className="relative w-24 h-24 mb-6">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full animate-spin-slow border-2 border-transparent border-t-primary border-r-primary/30" />
                {/* Inner glow circle */}
                <div className="absolute inset-3 rounded-full bg-primary/8 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#F5C518]/15 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#F5C518]" />
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground mb-5 tracking-wide">Loading payment details...</p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    style={{
                      animation: "pulse 1.4s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            /* Purchase Form */
            <motion.div
              key="form"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {/* Price Card */}
              <motion.div
                variants={item}
                className="glass-card rounded-2xl p-8 flex flex-col items-center text-center mb-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#F5C518] flex items-center justify-center mb-5 shadow-lg shadow-[#F5C518]/15">
                  <ShoppingCart className="w-7 h-7 text-background" />
                </div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-1.5">
                  Code Price
                </p>
                <p className="text-4xl font-extrabold text-primary mb-3 tracking-tight">₦7,500</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Purchase a withdrawal code to unlock fund<br />withdrawals from your wallet.
                </p>
              </motion.div>

              {/* Username + CTA Card */}
              <motion.div
                variants={item}
                className="glass-card rounded-2xl p-5"
              >
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-3">
                  Username
                </p>
                <div className="inner-card flex items-center gap-3 rounded-xl px-4 py-3.5 mb-5">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground font-mono-app">ndslt0245208</span>
                </div>
                <button
                  onClick={() => navigate("/payment")}
                  className="btn-cta w-full h-12 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  Proceed to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BuyCode;
