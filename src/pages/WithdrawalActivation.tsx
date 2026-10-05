import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, LockKeyhole, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const WithdrawalActivation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const withdrawalId = params.get("id");
  const [link, setLink] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !withdrawalId) return;
    let cancelled = false;
    (async () => {
      const [{ data: withdrawal }, { data: setting }] = await Promise.all([
        supabase.from("withdrawal_requests").select("id, amount, status").eq("id", withdrawalId).eq("user_id", user.id).maybeSingle(),
        supabase.from("app_settings").select("value").eq("key", "withdrawal_activation_url").maybeSingle(),
      ]);
      if (cancelled) return;
      if (!withdrawal) {
        navigate("/main", { replace: true });
        return;
      }
      if (withdrawal.status === "approved") {
        navigate(`/withdrawal-approved?id=${withdrawal.id}`, { replace: true });
        return;
      }
      if (withdrawal.status === "rejected") {
        navigate(`/withdrawal-success`, { replace: true, state: { id: withdrawal.id, amount: withdrawal.amount } });
        return;
      }
      setAmount(Number(withdrawal.amount));
      setLink((setting?.value || "").trim());
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, withdrawalId, navigate]);

  useEffect(() => {
    if (!withdrawalId) return;
    const channel = supabase
      .channel(`withdrawal-activation-${withdrawalId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "withdrawal_requests", filter: `id=eq.${withdrawalId}` }, (payload) => {
        const row: any = payload.new;
        if (row?.status === "approved" && row?.withdrawal_code) navigate(`/withdrawal-approved?id=${withdrawalId}`, { replace: true });
        if (row?.status === "rejected") navigate("/withdrawal-success", { replace: true, state: { id: withdrawalId, amount: row.amount } });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [withdrawalId, navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div className="relative min-h-screen bg-background overflow-hidden px-4 py-8 flex items-center justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[360px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <button onClick={() => navigate("/main")} className="glass-card w-9 h-9 rounded-xl flex items-center justify-center mb-6 text-muted-foreground"><ArrowLeft className="w-4 h-4" /></button>
        <div className="glass-card rounded-3xl p-6 text-center border border-orange-400/20 shadow-2xl">
          <div className="mx-auto w-20 h-20 rounded-full bg-orange-400/10 border border-orange-400/20 flex items-center justify-center mb-5">
            <LockKeyhole className="w-9 h-9 text-orange-400" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-orange-400 mb-2">Withdrawal On Hold</p>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">Activate Your Account</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">Your withdrawal request{amount !== null ? ` for ₦${amount.toLocaleString()}` : ""} is waiting for account activation. Activate your account using the button below, then your request can continue.</p>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="btn-cta w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2">Activate Account <ExternalLink className="w-4 h-4" /></a>
          ) : (
            <div className="rounded-xl bg-secondary/60 border border-border p-3 text-xs text-muted-foreground">The activation link is not available yet. Please check again shortly or contact support.</div>
          )}
          <p className="text-[9px] text-muted-foreground mt-4">Your withdrawal remains pending until the admin completes the review.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default WithdrawalActivation;
