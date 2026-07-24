import { useAuth } from "@/contexts/AuthContext";

export interface TelegramGateState {
  loading: boolean;
  required: boolean;
  completed: boolean;
  channelUrl: string;
  refresh: () => void;
}

const DEFAULT_URL = "https://t.me/+Mg7JaPJoFNVhMTc0";

// Telegram onboarding is disabled. We keep the hook and DB columns intact but
// short-circuit checks so the site always treats onboarding as completed.
export const useTelegramGate = (): TelegramGateState => {
  const { user, loading: authLoading } = useAuth();

  // Keep the API shape and avoid any DB calls. This ensures there are no
  // runtime or database side-effects while making the gate inactive.
  return {
    loading: false,
    required: false,
    completed: true,
    channelUrl: DEFAULT_URL,
    refresh: () => {},
  };
};
