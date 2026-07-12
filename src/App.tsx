import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Signup from "./pages/Signup.tsx";
import SignupSuccess from "./pages/SignupSuccess.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.tsx";
import Main from "./pages/Main.tsx";
import Profile from "./pages/Profile.tsx";
import EarnMore from "./pages/EarnMore.tsx";
import SpinAndEarn from "./pages/SpinAndEarn.tsx";
import History from "./pages/History.tsx";
import Support from "./pages/Support.tsx";
import Channel from "./pages/Channel.tsx";
import Withdraw from "./pages/Withdraw.tsx";
import WithdrawRequest from "./pages/WithdrawRequest.tsx";
import WithdrawalSuccess from "./pages/WithdrawalSuccess.tsx";
import WithdrawalApproved from "./pages/WithdrawalApproved.tsx";
import AdminPaymentSettings from "./pages/AdminPaymentSettings.tsx";
import AdminReferrals from "./pages/AdminReferrals.tsx";
import DailyTasks from "./pages/DailyTasks.tsx";
import BuyCode from "./pages/BuyCode.tsx";
import Payment from "./pages/Payment.tsx";
import PaymentReceipt from "./pages/PaymentReceipt.tsx";
import PaymentReview from "./pages/PaymentReview.tsx";
import PaymentApproved from "./pages/PaymentApproved.tsx";
import Admin from "./pages/Admin.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PullToRefresh from "./components/PullToRefresh.tsx";
import InstallPrompt from "./components/InstallPrompt.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PullToRefresh>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup-success" element={<ProtectedRoute><SignupSuccess /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/main" element={<ProtectedRoute><Main /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/earn-more" element={<ProtectedRoute><EarnMore /></ProtectedRoute>} />
            <Route path="/spin" element={<ProtectedRoute><SpinAndEarn /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/channel" element={<Channel />} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
            <Route path="/withdraw-request" element={<ProtectedRoute><WithdrawRequest /></ProtectedRoute>} />
            <Route path="/withdrawal-success" element={<ProtectedRoute><WithdrawalSuccess /></ProtectedRoute>} />
            <Route path="/withdrawal-approved" element={<ProtectedRoute><WithdrawalApproved /></ProtectedRoute>} />
            <Route path="/admin/payment-settings" element={<ProtectedRoute><AdminPaymentSettings /></ProtectedRoute>} />
            <Route path="/admin/referrals" element={<ProtectedRoute><AdminReferrals /></ProtectedRoute>} />
            <Route path="/daily-tasks" element={<ProtectedRoute><DailyTasks /></ProtectedRoute>} />
            <Route path="/buy-code" element={<ProtectedRoute><BuyCode /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/payment-receipt" element={<ProtectedRoute><PaymentReceipt /></ProtectedRoute>} />
            <Route path="/payment-review" element={<ProtectedRoute><PaymentReview /></ProtectedRoute>} />
            <Route path="/payment-approved" element={<ProtectedRoute><PaymentApproved /></ProtectedRoute>} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <InstallPrompt />
          </PullToRefresh>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
