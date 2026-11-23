'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  RotateCw,
  Copy,
  CheckCircle2,
  Home,
  ShieldCheck,
  AlignLeft,
  Phone,
  Headphones,
  DoorClosed,
  Hourglass,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';

/* Custom SVG Icons for Screen 10 */
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

function ServiceStatusContent() {
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
    showToast(`Request reference ${textToCopy} copied to clipboard!`);
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
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-5 sm:space-y-6">
        {/* Top Header Bar: < Service Confirmation & Bronze Monogram */}
        <header className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-2">
            <Link
              href="/guest/services/confirmation"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#201A15] hover:bg-[#F2ECE3] transition"
              aria-label="Back to Service Confirmation"
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

        {/* Request Status Heading Row */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] tracking-tight">
            Request Status
          </h2>

          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE7DE] text-[#695D50] text-xs font-bold border border-[#DDD5CB] shadow-2xs hover:bg-[#E2DACF] transition cursor-pointer"
          >
            <span>{isLiteralMockup ? '#NV-000000' : ticketId}</span>
            <Copy className="w-3.5 h-3.5 text-[#695D50]" />
          </button>
        </div>

        {/* Card 1: Live Sync Active Bar */}
        <section className="bg-[#F8F5F0] rounded-2xl p-3.5 sm:p-4 border border-[#ECE5DB] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C5D29] animate-pulse shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074] leading-tight">
                LIVE SYNC ACTIVE
              </p>
              <p className="text-xs text-[#5A5046] mt-0.5 leading-tight">
                Updated just now
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074] leading-tight">
              PRIORITY LINE
            </p>
            <p className="text-xs font-bold text-[#201A15] mt-0.5 leading-tight">
              {isLiteralMockup ? 'ROOM • Today, 4:28 PM' : `ROOM ${roomNumber} • Today, 4:28 PM`}
            </p>
          </div>
        </section>

        {/* Card 2: Status Banner Card */}
        <section className="bg-white rounded-2xl p-5 border border-[#EFE9DF] shadow-2xs space-y-3">
          {/* Top Row: Rotating sync arrows icon & IN PROGRESS badge */}
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-full bg-[#FCEEE1] border border-[#F6D7BC] text-[#8C5D29] flex items-center justify-center shadow-xs">
              <RotateCw className="w-5 h-5 text-[#8C5D29]" />
            </div>

            <span className="inline-block bg-[#FDF0E2] border border-[#F6E3CF] text-[#8C5D29] text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              IN PROGRESS
            </span>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-0.5">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] tracking-tight">
              In Progress
            </h3>
            <p className="text-xs sm:text-sm text-[#665D52] font-medium leading-relaxed">
              The hotel is working on your request.
            </p>
          </div>

          {/* Door Dispatch Banner */}
          <div className="bg-[#F8F5F0] rounded-xl p-3 border border-[#EAE3D9] flex items-center gap-2.5 text-xs text-[#5A5046]">
            <DoorClosed className="w-4 h-4 text-[#705535] shrink-0" />
            <span>
              Dedicated hospitality team dispatched to ROOM {isLiteralMockup ? '.' : `${roomNumber}.`}
            </span>
          </div>
        </section>

        {/* Card 3: Dispatch Timeline */}
        <section className="bg-white rounded-2xl p-5 border border-[#EFE9DF] shadow-2xs space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
              Dispatch Timeline
            </h3>

            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A8074]">
              ESTIMATED 15–20 MIN
            </span>
          </div>

          {/* Vertical Stepper List */}
          <div className="space-y-4 pt-1">
            {/* Step 1: Request Received */}
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm text-[#201A15]">
                    1. Request Received
                  </span>
                  <span className="text-xs text-[#8A8074]">4:28 PM</span>
                </div>
                <p className="text-xs text-[#7A6F63]">
                  Logged in hospitality system
                </p>
              </div>
            </div>

            {/* Step 2: Accepted by Dispatch */}
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm text-[#201A15]">
                    2. Accepted by Dispatch
                  </span>
                  <span className="text-xs text-[#8A8074]">4:31 PM</span>
                </div>
                <p className="text-xs text-[#7A6F63]">
                  Assigned to Floor 4 Attendant
                </p>
              </div>
            </div>

            {/* Step 3: In Progress (Active) */}
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-[#FCEEE1] border border-[#F6D7BC] text-[#8C5D29] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Hourglass className="w-3.5 h-3.5 text-[#8C5D29]" />
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm text-[#705535]">
                    3. In Progress
                  </span>
                  <span className="text-xs font-bold text-[#C27E43] uppercase tracking-wider">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-[#7A6F63]">
                  Supplies collected &amp; en route
                </p>
              </div>
            </div>

            {/* Step 4: Delivered & Completed (Pending) */}
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full border-2 border-[#D4CCC0] bg-[#F8F5F0] flex items-center justify-center shrink-0 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A89F93]" />
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm text-[#554C42]">
                    4. Delivered &amp; Completed
                  </span>
                  <span className="text-[10px] font-bold text-[#A89F93] uppercase tracking-wider">
                    PENDING
                  </span>
                </div>
                <p className="text-xs text-[#9E9486]">
                  Attendant completed service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Card 4: Service Requisition */}
        <section className="bg-white rounded-2xl p-5 border border-[#EFE9DF] shadow-2xs space-y-3.5">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-2.5">
            <div className="flex items-center gap-2">
              <ClocheIcon className="w-4 h-4 text-[#705535]" />
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                Service Requisition
              </h3>
            </div>

            <span className="bg-[#EDE7DE] text-[#695D50] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              AMENITIES
            </span>
          </div>

          {/* Service Item Box */}
          <div className="bg-[#F8F5F0] rounded-xl p-3.5 border border-[#EAE3D9] flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAE2D8] text-[#705535] flex items-center justify-center shrink-0">
              <TowelRackIcon className="w-5 h-5 text-[#705535]" />
            </div>

            <div className="space-y-0.5">
              <h4 className="font-bold text-sm sm:text-base text-[#201A15] leading-snug">
                {isLiteralMockup
                  ? 'Extra Plush Bath Towels & Water'
                  : latestRequest?.serviceCategory || 'Extra Plush Bath Towels & Water'}
              </h4>
              <p className="text-xs text-[#7A6F63]">
                {isLiteralMockup
                  ? 'Qty: 2 Bath Sheets, 2 Hand Towels, 2 San Pellegrino'
                  : latestRequest?.requestItem || 'Qty: 2 Bath Sheets, 2 Hand Towels, 2 San Pellegrino'}
              </p>
            </div>
          </div>

          {/* Guest Note Box */}
          <div className="bg-[#F8F5F0] rounded-xl p-3.5 border border-[#EAE3D9] space-y-1">
            <div className="flex items-center gap-1.5 text-[#7A6F63]">
              <AlignLeft className="w-3.5 h-3.5 text-[#7A6F63]" />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                GUEST NOTE
              </span>
            </div>

            <p className="text-xs text-[#554C42] italic leading-relaxed">
              {isLiteralMockup
                ? '“Please leave by the master bathroom vanity. Fresh washcloths appreciated.”'
                : latestRequest?.notes || '“Please leave by the master bathroom vanity. Fresh washcloths appreciated.”'}
            </p>
          </div>

          {/* Standard Turnaround Note */}
          <div className="flex items-start gap-2 pt-1 text-xs text-[#6B6155] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#705535] shrink-0 mt-0.5" />
            <span>
              Standard turnaround 15–20 minutes. Attendant will knock gently unless Do Not Disturb is toggled.
            </span>
          </div>
        </section>

        {/* Card 5: Concierge Desk Card */}
        <section className="bg-[#EAE4DC]/80 rounded-2xl p-3.5 sm:p-4 border border-[#DDD5CB] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#705535] text-white flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-white" />
            </div>

            <h4 className="font-bold text-sm sm:text-base text-[#201A15]">
              Concierge Desk
            </h4>
          </div>

          <a
            href="tel:+912245891200"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#201A15] border border-[#DDD5CB] text-xs font-bold shadow-xs hover:bg-[#F8F5F0] transition active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-[#705535]" />
            <span>CALL</span>
          </a>
        </section>

        {/* Action CTAs */}
        <div className="pt-2 space-y-3 text-center">
          {/* Bronze Button: NEED ANOTHER SERVICE? */}
          <Link
            href="/guest/services"
            className="w-full py-4 px-6 rounded-2xl bg-[#705535] hover:bg-[#5C452A] text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition active:scale-98"
          >
            <ClocheIcon className="w-4 h-4 text-white" />
            <span>NEED ANOTHER SERVICE?</span>
          </Link>

          {/* Return to ROOM Home Text Link */}
          <Link
            href="/guest"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5A5046] hover:text-[#201A15] transition py-1 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#705535]" />
            <span>Return to ROOM Home</span>
          </Link>
        </div>
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D8] shadow-lg">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-around h-16 px-4 sm:px-8">
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

export default function ServiceStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ServiceStatusContent />
    </Suspense>
  );
}
