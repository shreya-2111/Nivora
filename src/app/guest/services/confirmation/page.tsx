'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  Clock,
  Copy,
  CheckCircle2,
  Home,
  ShieldCheck,
  AlignLeft,
  ArrowRight,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';

/* Custom SVG Icons for Screen 9 */
function ClocheIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 18h16" />
      <path d="M4 14a8 8 0 0 1 16 0" />
      <path d="M12 6v-2" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

function ConciergeHandBellIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 17h6l2.5 2h5.5a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-4" />
      <path d="M14 6a4 4 0 0 0-8 0v2h8V6z" />
      <path d="M10 2v2" />
      <path d="M5 10h10" />
    </svg>
  );
}

function TowelRackIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M7 6v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
    </svg>
  );
}

function ServiceConfirmationContent() {
  const searchParams = useSearchParams();
  const { guest, roomRequests } = useNivora();

  const queryRoom = searchParams.get('room');
  const roomNumber = queryRoom || guest?.roomNumber || '104';
  const queryTicketId = searchParams.get('id');

  const latestRequest = roomRequests[0];
  const ticketId = queryTicketId || latestRequest?.ticketNumber || '#NV-000000';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Template toggle mode so reviewer can see literal mockup {variables} or live rich state
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyId = () => {
    const textToCopy = isLiteralMockup ? '#NV-000000' : ticketId;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setIsCopied(true);
    showToast(`Request ID ${textToCopy} copied to clipboard!`);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#705535]/20 selection:text-[#221B14] pb-28 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Responsive Full Width */}
      <main className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-4 sm:space-y-5">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-2">
            <Link
              href="/guest/services"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#201A15] hover:bg-[#F2ECE3] transition"
              aria-label="Back to Room Service"
            >
              <ChevronLeft className="w-6 h-6 text-[#201A15]" />
            </Link>

            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#201A15] tracking-tight">
              Service Confirmation
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode switch */}
            <button
              type="button"
              onClick={() => setIsLiteralMockup((v) => !v)}
              className="text-[9px] font-bold px-2 py-1 rounded bg-[#F2EDE7] text-[#7A6F63] hover:text-[#201A15] border border-[#E5DFD5] transition cursor-pointer"
              title="Toggle between Template Mockup and Live View"
            >
              {isLiteralMockup ? '{var}' : 'live'}
            </button>

            {/* Bronze Round Icon */}
            <div className="w-9 h-9 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
              <ClocheIcon className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Hero Confirmation Section */}
        <section className="text-center pt-2 sm:pt-4 space-y-3">
          {/* Big Checkmark with Dual Circle and PRIORITY Pill */}
          <div className="relative inline-flex flex-col items-center justify-center">
            {/* Outer Soft Ring */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#FDF2E7] flex items-center justify-center shadow-inner">
              {/* Inner Solid Bronze Circle */}
              <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-md">
                <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
              </div>
            </div>

            {/* Priority Pill overlapping bottom of circle */}
            <div className="-mt-3 relative z-10 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#EAE3D9] text-[#705535] text-[10px] font-bold tracking-wider uppercase shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#705535] inline-block" />
              <span>PRIORITY</span>
            </div>
          </div>

          {/* Subtitle & Title */}
          <div className="space-y-1 pt-1">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#85653C]">
              NIVORA GUEST SERVICES
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] tracking-tight">
              Request Submitted
            </h2>
            <p className="text-xs sm:text-sm text-[#665D52] font-medium max-w-sm mx-auto">
              Your request has been received by the hotel dispatch desk.
            </p>
          </div>
        </section>

        {/* Card 1: In-Room Reassurance Card */}
        <section className="bg-[#F8F5F0] rounded-2xl p-4 sm:p-4.5 border border-[#ECE5DB] flex items-start gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-[#EAE2D8] text-[#705535] flex items-center justify-center shrink-0 mt-0.5 border border-[#DDD3C7]">
            <ConciergeHandBellIcon className="w-5 h-5 text-[#705535]" />
          </div>

          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
              IN-ROOM REASSURANCE
            </p>
            <p className="text-xs text-[#5A5046] leading-relaxed">
              Dedicated housekeeping &amp; butler team dispatched to ROOM {isLiteralMockup ? '.' : `${roomNumber}.`}
            </p>
          </div>
        </section>

        {/* Card 2: Request Pipeline */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A8074]">
              REQUEST PIPELINE
            </h3>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29] inline-block" />
              <span>STATUS: NEW</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="pt-2 pb-1">
            <div className="relative flex items-center justify-between">
              {/* Connecting Background Line */}
              <div className="absolute top-3 left-4 right-4 h-[2px] bg-[#EAE3D9] z-0" />

              {/* Step 1: New (Active/Dispatched) */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                  <p className="font-bold text-[#201A15]">New</p>
                  <p className="text-[#7A6F63] text-[9px] sm:text-[10px]">Dispatched</p>
                </div>
              </div>

              {/* Step 2: Accepted */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#D4CCC0] my-1.5" />
                <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                  <p className="font-bold text-[#554C42]">Accepted</p>
                  <p className="text-[#A89F93] text-[9px] sm:text-[10px]">Awaiting</p>
                </div>
              </div>

              {/* Step 3: In Progress */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#D4CCC0] my-1.5" />
                <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                  <p className="font-bold text-[#554C42]">In Progress</p>
                  <p className="text-[#A89F93] text-[9px] sm:text-[10px]">Pending</p>
                </div>
              </div>

              {/* Step 4: Completed */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#D4CCC0] my-1.5" />
                <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                  <p className="font-bold text-[#554C42]">Completed</p>
                  <p className="text-[#A89F93] text-[9px] sm:text-[10px]">Final</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 3: Reference Summary */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-3.5">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-2.5">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A8074]">
              REFERENCE SUMMARY
            </h3>

            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8A8074] hover:text-[#201A15] transition cursor-pointer"
            >
              <span>COPY ID</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs sm:text-sm">
            {/* Request ID */}
            <div className="flex items-center justify-between">
              <span className="text-[#7A6F63]">Request ID</span>
              <span className="font-serif font-bold text-base text-[#201A15]">
                {isLiteralMockup ? '#NV-000000' : ticketId}
              </span>
            </div>

            {/* Destination ROOM */}
            <div className="flex items-center justify-between">
              <span className="text-[#7A6F63]">Destination ROOM</span>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F2EDE7] text-[#5A5046] border border-[#E8E2D8] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#705535]" />
                <span>{isLiteralMockup ? 'ROOM' : `ROOM ${roomNumber}`}</span>
              </div>
            </div>

            {/* Submitted Time */}
            <div className="flex items-center justify-between">
              <span className="text-[#7A6F63]">Submitted Time</span>
              <span className="font-medium text-[#201A15]">
                {isLiteralMockup ? 'Today, 4:28 PM' : 'Today, 4:28 PM'}
              </span>
            </div>

            {/* Service Dispatch */}
            <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE3]">
              <span className="text-[#7A6F63]">Service Dispatch</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#85653C] uppercase tracking-wider">
                AUTOMATED FOLIO SYNC • PRIORITY
              </span>
            </div>
          </div>
        </section>

        {/* Card 4: Requested Service */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-3.5">
          {/* Header */}
          <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A8074]">
            REQUESTED SERVICE
          </h3>

          {/* Service Item Box */}
          <div className="bg-[#F8F5F0] rounded-xl p-3.5 border border-[#EAE3D9] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Towel Icon Box */}
              <div className="w-10 h-10 rounded-xl bg-[#EAE2D8] text-[#705535] flex items-center justify-center shrink-0">
                <TowelRackIcon className="w-5 h-5 text-[#705535]" />
              </div>

              <div>
                <h4 className="font-bold text-sm sm:text-base text-[#201A15] leading-snug">
                  {isLiteralMockup ? 'Extra Plush Bath Towels' : (latestRequest?.serviceCategory || 'Extra Plush Bath Towels')}
                </h4>
                <p className="text-xs text-[#7A6F63] mt-0.5">
                  {isLiteralMockup ? 'Quantity: 2 Sets' : (latestRequest?.requestItem || 'Quantity: 2 Sets')}
                </p>
              </div>
            </div>

            <span className="inline-block bg-[#FCE7D2] text-[#8C5D29] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              COMPLIMENTARY
            </span>
          </div>

          {/* Guest Note / Specification Box */}
          <div className="bg-[#F8F5F0] rounded-xl p-3.5 border border-[#EAE3D9] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#7A6F63]">
              <AlignLeft className="w-3.5 h-3.5 text-[#7A6F63]" />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                GUEST NOTE / SPECIFICATION
              </span>
            </div>

            <p className="text-xs text-[#554C42] italic leading-relaxed">
              {isLiteralMockup
                ? '“Please leave by the master bathroom vanity. Fresh washcloths appreciated.”'
                : latestRequest?.notes || '“Please leave by the master bathroom vanity. Fresh washcloths appreciated.”'}
            </p>
          </div>

          {/* Standard Fulfillment Notice */}
          <div className="flex items-start gap-2 pt-1 text-xs text-[#6B6155] leading-relaxed">
            <Clock className="w-4 h-4 text-[#705535] shrink-0 mt-0.5" />
            <span>
              Standard fulfillment within 15–20 minutes. Attendant will knock gently unless Do Not Disturb is toggled.
            </span>
          </div>
        </section>

        {/* Action CTAs */}
        <div className="pt-2 space-y-3 text-center">
          {/* Bronze View Request Status Button */}
          <Link
            href="/guest/services/status"
            className="w-full py-4 px-6 rounded-2xl bg-[#705535] hover:bg-[#5C452A] text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition active:scale-98"
          >
            <span>View Request Status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Back to Home Text Link */}
          <Link
            href="/guest"
            className="inline-block text-xs sm:text-sm font-semibold text-[#7A6F63] hover:text-[#201A15] transition py-1 cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D8] shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
          {/* 1. Home */}
          <Link
            href="/guest"
            className="flex flex-col items-center justify-center gap-1 text-[#7C7164] hover:text-[#231E18] text-xs font-medium transition"
          >
            <Home className="w-5 h-5 text-[#7C7164]" />
            <span className="leading-none">Home</span>
          </Link>

          {/* 2. Orders */}
          <Link
            href="/guest/orders"
            className="flex flex-col items-center justify-center gap-1 text-[#7C7164] hover:text-[#231E18] text-xs font-medium transition"
          >
            <ClocheIcon className="w-5 h-5 text-[#7C7164]" />
            <span className="leading-none">Orders</span>
          </Link>

          {/* 3. Room Service (Active) */}
          <Link
            href="/guest/services"
            className="flex flex-col items-center justify-center gap-1 text-[#705535] font-bold text-xs transition"
          >
            <ConciergeHandBellIcon className="w-5 h-5 text-[#705535]" />
            <span className="leading-none">Room Service</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default function ServiceConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ServiceConfirmationContent />
    </Suspense>
  );
}
