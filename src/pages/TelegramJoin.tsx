import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import flexooLogo from "@/assets/flexoo-logo.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TelegramJoin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [channelUrl, setChannelUrl] = useState("https://t.me/+Mg7JaPJoFNVhMTc0");
  const [opened, setOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannelUrl = async () => {
      try {
        const { data } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "telegram_channel_url")
          .maybeSingle();
        
        if (data?.value) {
          setChannelUrl(data.value);
        }
      } catch (error) {
        console.error("Error fetching channel URL:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannelUrl();
  }, []);

  const handleOpenChannel = () => {
    window.open(channelUrl, "_blank", "noopener,noreferrer");
    setOpened(true);
  };

  const handleContinue = async () => {
    if (!opened || submitting) return;
    setSubmitting(true);
    
    try {
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ telegram_join_completed: true })
          .eq("user_id", user.id);
        
        if (error) {
          toast.error(error.message || "Could not save completion. Try again.");
          setSubmitting(false);
          return;
        }
      }
      
      toast.success("Welcome aboard!");
      navigate("/home", { replace: true });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard", { replace: true });
  };

  const disabled = !opened || submitting;
  const label = !opened
    ? "I've Joined — Continue"
    : submitting
    ? "Verifying..."
    : "I've Joined — Continue";

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-tg" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(150, 20%, 40%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-tg)" />
        </svg>
      </div>
      <div className="bg-glow absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center max-w-md w-full"
      >
        <motion.div
          variants={item}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <img src={flexooLogo} alt="Flexoo Logo" className="w-12 h-12 object-contain" />
        </motion.div>

        <motion.h1 variants={item} className="text-3xl font-bold text-foreground mb-3">
          Welcome to <span className="text-primary">Flexoo</span>
        </motion.h1>
        <motion.p variants={item} className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">
          Join our official Telegram channel to stay updated with announcements and community updates.
        </motion.p>

        <motion.div
          variants={item}
          className="w-full rounded-2xl p-5"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground text-sm">Flexoo Official</p>
              <p className="text-xs text-muted-foreground">Telegram Channel</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenChannel}
            className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            style={{ background: "var(--gradient-cta)", color: "hsl(150, 30%, 6%)" }}
          >
            <Send className="w-4 h-4" />
            {opened ? "Re-open Channel" : "Join Channel"}
          </button>

          <p className="text-xs text-muted-foreground/60 mt-4 mb-3">
            {opened ? "You've opened the channel. Click continue below." : "After joining, tap Continue below"}
          </p>

          <button
            type="button"
            onClick={handleContinue}
            disabled={disabled}
            aria-disabled={disabled}
            className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 border border-primary/30 text-foreground disabled:opacity-50"
            style={{ background: "var(--glass-bg)" }}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <CheckCircle className="w-4 h-4 text-primary" />
            )}
            {label}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            disabled={submitting}
            className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-3 text-muted-foreground hover:text-foreground border border-border/40"
          >
            Skip for Now
          </button>
        </motion.div>

        <motion.p variants={item} className="mt-6 text-xs text-muted-foreground/60">
          Joining our Telegram channel is optional but recommended to stay connected.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default TelegramJoin;
