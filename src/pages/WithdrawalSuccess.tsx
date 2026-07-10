import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type SuccessState = {
  id?: string;
  amount?: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  createdAt?: string;
};

const maskAccount = (acc?: string) => {
  if (!acc) return "••••";
  const last4 = acc.slice(-4);
  return `${"•".repeat(Math.max(0, acc.length - 4))}${last4}`;
};

const Particles = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 6,
        color: Math.random() > 0.5 ? "#22c55e" : "#eab308",
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [-10, -60, -10] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: d.color,
            boxShadow: `0 0 12px ${d.color}`,
          }}
        />
      ))}
    </div>
  );
};

const WithdrawalSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as SuccessState) || {};
  const [now] = useState(() => new Date());

  useEffect(() => {
    if (!state.amount) {
      // no data — send back
      const t = setTimeout(() => navigate("/main", { replace: true }), 100);
      return () => clearTimeout(t);
    }
  }, [state.amount, navigate]);

  const createdAt = state.createdAt ? new Date(state.createdAt) : now;
  const referenceId = (state.id || `WDR-${Math.random().toString(36).slice(2, 10)}`).toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden flex items-center justify-center px-4 py-10">
      {/* ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />
      <Particles />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Check icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle at 30% 30%, #86efac, #22c55e 55%, #ca8a04 110%)",
              boxShadow: "0 0 60px rgba(34,197,94,0.45), 0 0 120px rgba(234,179,8,0.25)",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-white/20"
            />
            <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur flex items-center justify-center border border-white/10">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        </div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight"
        >
          Request Submitted!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-white/60 text-center mt-2 mb-8 leading-relaxed"
        >
          Your withdrawal request has been received and is currently being processed.
        </motion.p>

        {/* Amount card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-5 mb-3 border border-white/5 backdrop-blur-xl text-center"
          style={{
            background: "linear-gradient(160deg, rgba(34,197,94,0.08), rgba(255,255,255,0.02))",
            boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)",
          }}
        >
          <p className="text-[10px] font-bold tracking-[0.25em] text-white/50 uppercase mb-2">Amount</p>
          <p className="text-4xl font-extrabold text-emerald-400 tracking-tight">
            ₦{Number(state.amount || 0).toLocaleString()}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-yellow-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-yellow-400" />
            </span>
            <span className="text-[11px] font-semibold text-yellow-300">Processing</span>
            <span className="text-[11px] text-white/50">· Usually within 24 hours</span>
          </div>
        </motion.div>

        {/* Details card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-4 mb-6 border border-white/5 backdrop-blur-xl divide-y divide-white/5"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
          }}
        >
          <Row label="Bank" value={state.bankName || "—"} />
          <Row label="Account" value={maskAccount(state.accountNumber)} mono />
          <Row label="Reference ID" value={referenceId} mono />
          <Row
            label="Date & Time"
            value={createdAt.toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <div className="flex items-center justify-between py-2.5">
            <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Status</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-300">
              <Clock className="w-3.5 h-3.5" />
              Processing
            </span>
          </div>
        </motion.div>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/main", { replace: true })}
          className="w-full h-13 py-3.5 rounded-2xl font-bold text-black text-sm tracking-wide"
          style={{
            background: "linear-gradient(90deg, #22c55e 0%, #a3e635 50%, #eab308 100%)",
            boxShadow: "0 10px 30px -10px rgba(34,197,94,0.6), 0 0 20px rgba(234,179,8,0.25)",
          }}
        >
          Back to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
};

const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-center justify-between py-2.5">
    <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">{label}</span>
    <span className={`text-sm text-white font-semibold ${mono ? "font-mono tracking-wider" : ""}`}>{value}</span>
  </div>
);

export default WithdrawalSuccess;
