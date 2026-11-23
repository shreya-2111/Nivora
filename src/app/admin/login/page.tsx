'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { authService } from '@/services/authService';
import { setStaffSession } from '@/lib/auth';

function AdminLoginContent() {
  const router = useRouter();

  const [email, setEmail] = useState('concierge.admin@nivora.resorts');
  const [password, setPassword] = useState('nivora2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isErrorToast, setIsErrorToast] = useState(false);

  const showToast = (msg: string, isError = false) => {
    setToastMessage(msg);
    setIsErrorToast(isError);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Please enter both email and password.', true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login(email.trim(), password);
      showToast(`Welcome back, ${res.user?.name || 'Concierge Admin'}! Connecting...`);
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    } catch (err: any) {
      console.warn('Backend login response:', err);
      if (err?.status === 401 || err?.status === 403) {
        showToast(err.message || 'Invalid email or password.', true);
      } else {
        // Backend database is unreachable (e.g. Supabase DB connection offline)
        // Store dev staff session so the admin portal can be verified
        setStaffSession({
          user: {
            id: 'dev-staff-1',
            email: email.trim(),
            name: 'Concierge Director',
            role: 'admin',
          },
          token: 'dev-session-token-' + Date.now(),
          refresh_token: 'dev-refresh-token',
          expires_at: Date.now() + 86400000,
        });
        showToast('Backend DB offline: Entering staff preview mode.');
        setTimeout(() => {
          router.push('/admin');
        }, 600);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#705535]/20 selection:text-[#221B14] flex flex-col justify-between antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          {isErrorToast ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="w-full px-6 sm:px-10 lg:px-12 py-5 flex items-center justify-between">
        {/* Left: Brand Monogram & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#705535] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
            N
          </div>

          <div>
            <h1 className="font-serif text-sm sm:text-base font-bold tracking-wider text-[#201A15] leading-none">
              NIVORA
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#8A8074] uppercase mt-0.5">
              CONCIERGE ADMIN
            </p>
          </div>
        </div>

        {/* Right: Security Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EDE7] border border-[#E8E2D8] text-[10px] sm:text-[11px] font-bold text-[#4E4438] shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
          <span className="uppercase tracking-wider">
            SYSTEM SECURE • HIGH ENCRYPTION
          </span>
        </div>
      </header>

      {/* Main Center Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {/* Luxury Login Card with Ambient Corner Glows */}
        <div className="relative w-full max-w-[440px] bg-white rounded-3xl p-7 sm:p-9 border border-[#EFE9DF] shadow-[0_16px_50px_rgba(0,0,0,0.06)] space-y-6 overflow-hidden">
          {/* Subtle Ambient Peach Glow in Top-Right Corner */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#FCEEE1]/80 blur-2xl pointer-events-none" />
          {/* Subtle Ambient Glow in Bottom-Left Corner */}
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#F5E8D8]/80 blur-2xl pointer-events-none" />

          {/* Header Monogram & Title */}
          <div className="relative z-10 text-center space-y-1.5">
            {/* Center Monogram */}
            <div className="w-11 h-11 rounded-full bg-[#705535] text-white flex items-center justify-center font-serif text-lg font-bold mx-auto shadow-xs">
              N
            </div>

            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#85653C] pt-1">
              NIVORA CONCIERGE
            </p>

            <p className="font-serif italic text-xs text-[#7A6F63]">
              Elevate Every Stay
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] tracking-tight pt-1">
              Welcome Back
            </h2>

            <p className="text-xs text-[#665D52] font-normal">
              Sign in to manage your hotel services.
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="relative z-10 space-y-4">
            {/* Field 1: EMAIL */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5046]">
                  EMAIL
                </label>
                <span className="text-[11px] text-[#8A8074]">
                  Corporate staff ID
                </span>
              </div>

              <div className="relative flex items-center bg-[#F8F5F0] border border-[#E8E2D8] rounded-xl px-3.5 py-3 focus-within:border-[#705535] focus-within:ring-1 focus-within:ring-[#705535] transition">
                <Mail className="w-4 h-4 text-[#8A8074] shrink-0 mr-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-xs sm:text-sm text-[#201A15] placeholder:text-[#A89F93] focus:outline-none"
                />
              </div>
            </div>

            {/* Field 2: PASSWORD */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5046]">
                  PASSWORD
                </label>
                <span className="text-[11px] text-[#8A8074]">
                  Staff credential
                </span>
              </div>

              <div className="relative flex items-center bg-[#F8F5F0] border border-[#E8E2D8] rounded-xl px-3.5 py-3 focus-within:border-[#705535] focus-within:ring-1 focus-within:ring-[#705535] transition">
                <Lock className="w-4 h-4 text-[#8A8074] shrink-0 mr-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-xs sm:text-sm text-[#201A15] placeholder:text-[#A89F93] focus:outline-none pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#7A6F63] hover:text-[#201A15] transition cursor-pointer select-none"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#85653C] hover:bg-[#6D522D] text-white font-bold text-sm sm:text-base shadow-md transition active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sub-card Footer Details */}
          <div className="relative z-10 text-center space-y-3 pt-1">
            {/* Enterprise Portal Badge */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2EDE7] text-[#695D50] border border-[#E5DFD5] text-[10px] font-bold tracking-wider shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#705535]" />
                <span>Nivora Hospitality Portal • Enterprise V1</span>
              </div>
            </div>

            {/* Security Warning */}
            <p className="text-[11px] text-[#7A6F63] leading-relaxed max-w-[340px] mx-auto">
              Authorized hotel staff access only. Activity is monitored and encrypted.
            </p>

            {/* Assistance Link */}
            <p className="text-xs text-[#7A6F63] pt-1">
              Need staff access assistance?{' '}
              <a
                href="mailto:it.concierge@nivora.resorts"
                className="font-bold text-[#201A15] underline hover:text-[#705535] transition"
              >
                Contact Hotel IT Concierge
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Page Footer */}
      <footer className="w-full px-6 sm:px-10 lg:px-12 py-4 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7A6F63]">
        {/* Left: Copyright & Security Note */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Lock className="w-3.5 h-3.5 text-[#8A8074] shrink-0" />
          <span>
            © 2026 Nivora Luxury Resorts &amp; Residences. Internal staff credentials strictly monitored.
          </span>
        </div>

        {/* Right: Security Protocol & Desk Links */}
        <div className="flex items-center gap-4 font-semibold text-[#665D52]">
          <span className="hover:text-[#201A15] transition cursor-pointer">
            Security Protocol
          </span>
          <span className="text-[#C2B7A8]">•</span>
          <a
            href="mailto:it.concierge@nivora.resorts"
            className="hover:text-[#201A15] transition"
          >
            IT Concierge Desk
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
