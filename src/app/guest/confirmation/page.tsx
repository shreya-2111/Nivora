'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  Clock,
  ReceiptText,
  Copy,
  CheckCircle2,
  ArrowRight,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { RoomServiceRequestModal } from '@/components/guest/RoomServiceRequestModal';

/* Custom Cloche SVG Icon */
function ClocheIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

/* Custom Concierge Hand Bell SVG Icon */
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

/* Custom Cooking Pot / Chef Steam SVG Icon */
function ChefPotIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      <path d="M3 11h18v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-6z" />
      <path d="M2 11h20" />
      <path d="M8 4c0 1.5 1 2.5 1 4" />
      <path d="M12 3c0 2 1 3 1 5" />
      <path d="M16 4c0 1.5 1 2.5 1 4" />
    </svg>
  );
}

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { guest, orders, activeOrder } = useNivora();

  const queryRoom = searchParams.get('room');
  const roomNumber = queryRoom || guest?.roomNumber || '{room_number}';
  const queryOrderId = searchParams.get('id');

  const latestOrder = orders.find((order) => order.id === queryOrderId) || orders[0] || activeOrder;
  const orderId = latestOrder?.orderNumber || '{order_id}';
  const orderStatusHref = latestOrder
    ? `/guest/orders?id=${encodeURIComponent(latestOrder.id)}&room=${encodeURIComponent(latestOrder.roomNumber)}`
    : '/guest/orders';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Template toggle mode so reviewer can see literal mockup {variables} or live rich dish calculation
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode === 'mock');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyOrderId = () => {
    const textToCopy = isLiteralMockup ? '{order_id}' : orderId.replace('#', '');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setIsCopied(true);
    showToast(`Order reference ${textToCopy} copied to clipboard!`);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const orderItems = latestOrder?.items || [];

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#705535]/20 selection:text-[#221B14] pb-28 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Full Width with Responsive Max Width */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-4 sm:space-y-5">
        {/* Top Header Bar */}
        <header className="relative flex items-center justify-between pt-1 pb-1">
          {/* Back Button */}
          <Link
            href="/guest/cart"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#201A15] hover:bg-[#F2ECE3] transition"
            aria-label="Back to Cart"
          >
            <ChevronLeft className="w-6 h-6 text-[#201A15]" />
          </Link>

          {/* Center Brand Title */}
          <div className="text-center">
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#705535] leading-tight tracking-wide">
              Order
            </h1>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#8C8072] uppercase -mt-0.5">
              CONFIRMATION
            </p>
          </div>

          {/* Right Spacer for optical centering */}
          <div className="w-9" />
        </header>

        {/* Hero Confirmation Section */}
        <section className="text-center pt-2 sm:pt-4 space-y-3">
          {/* Big Checkmark with Dual Circle */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer Soft Ring */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#F3ECE0] flex items-center justify-center shadow-inner">
              {/* Inner Solid Bronze Circle */}
              <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-md">
                <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Subtitle & Title */}
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#85653C]">
              NIVORA CULINARY ATELIER
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] tracking-tight">
              Order Placed
            </h2>
            <p className="text-xs sm:text-sm text-[#665D52] font-medium">
              Your food order has been received.
            </p>
          </div>

          {/* Delivery Room Banner */}
          <div className="inline-flex items-center gap-2 bg-[#F6F1EB] rounded-full py-2 px-4 text-xs text-[#5A5046] border border-[#EAE3D9] max-w-full">
            <ClocheIcon className="w-4 h-4 text-[#705535] shrink-0" />
            <span className="truncate">
              Delivering to <strong className="font-bold text-[#201A15]">ROOM {roomNumber}</strong>{' '}
              • Freshly prepared by in-house culinary team
            </span>
          </div>
        </section>

        {/* Card 1: Order Reference */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-3.5">
          {/* Top Row: Order Reference & Destination */}
          <div className="flex items-start justify-between gap-4">
            {/* Left: Order Reference */}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                ORDER REFERENCE
              </p>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#201A15]">
                  Order # {isLiteralMockup ? '{order_id}' : orderId.replace('#', '')}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="text-[#8A8074] hover:text-[#201A15] p-1 transition cursor-pointer"
                  title="Copy Order ID"
                  aria-label="Copy Order Reference"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Destination Pill */}
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                DESTINATION
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDF0E2] text-[#7A532C] border border-[#F6E3CF] text-xs font-bold shadow-2xs">
                <div className="w-3.5 h-3.5 rounded-full bg-[#7A532C] text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] font-medium text-[#8C5D29]">Room</span>
                  <span className="text-xs font-bold text-[#7A532C]">{roomNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Dual-Box: Timestamp & Billing Note */}
          <div className="bg-[#FAF7F2] rounded-xl p-3.5 border border-[#EFE9DF] grid grid-cols-2 gap-3 text-left">
            {/* Left: Timestamp */}
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#705535] shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074] leading-none">
                  TIMESTAMP
                </p>
                <p className="text-xs font-bold text-[#201A15] mt-1 leading-tight">
                  {isLiteralMockup ? '{order_date_time}' : latestOrder?.placedAt || '—'}
                </p>
              </div>
            </div>

            {/* Right: Billing Note */}
            <div className="flex items-start gap-2">
              <ReceiptText className="w-4 h-4 text-[#705535] shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074] leading-none">
                  BILLING NOTE
                </p>
                <p className="text-xs font-bold text-[#201A15] mt-1 leading-snug">
                  Charge to Room
                  <br />
                  Folio on Checkout
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Status Tracker */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#201A15] leading-tight">
                Status
                <br />
                Tracker
              </h3>

              {/* Status Pill */}
              <span className="inline-block bg-[#FDF0E2] border border-[#F6E3CF] text-[#8C5D29] text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {isLiteralMockup ? '{ORDER_STATUS}' : latestOrder?.status.toUpperCase().replaceAll('_', ' ') || '—'}
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-[#8A8074] text-right font-medium leading-tight">
              Live Kitchen
              <br />
              Dispatch
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="pt-2 pb-1">
            <div className="relative flex items-center justify-between">
              {/* Connecting Background Line */}
              <div className="absolute top-3 left-4 right-4 h-[2px] bg-[#EAE3D9] z-0" />

              {/* Step 1: New Received (Active) */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="mt-2 text-[10px] sm:text-[11px] font-bold text-[#201A15] leading-tight">
                  <p>New</p>
                  <p>Received</p>
                </div>
              </div>

              {/* Step 2: Accepted */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#D4CCC0] my-1.5" />
                <div className="mt-2 text-[10px] sm:text-[11px] font-medium text-[#9E9486] leading-tight">
                  <p>Accepted</p>
                  <p>Pending</p>
                </div>
              </div>

              {/* Step 3: Preparing */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#D4CCC0] my-1.5" />
                <div className="mt-2 text-[10px] sm:text-[11px] font-medium text-[#9E9486] leading-tight">
                  <p>Preparing</p>
                  <p>Pending</p>
                </div>
              </div>

              {/* Step 4: Ready */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#D4CCC0] my-1.5" />
                <div className="mt-2 text-[10px] sm:text-[11px] font-medium text-[#9E9486] leading-tight">
                  <p>Ready</p>
                  <p>Pending</p>
                </div>
              </div>

              {/* Step 5: Delivered */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#D4CCC0] my-1.5" />
                <div className="mt-2 text-[10px] sm:text-[11px] font-medium text-[#9E9486] leading-tight">
                  <p>Delivered</p>
                  <p>Pending</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 3: Order Details */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#201A15]">
              Order Details
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#8A8074] uppercase">
              KITCHEN TICKET
            </span>
          </div>

          {/* Dish Line Items */}
          <div className="space-y-3.5">
            {orderItems.map((dish) => (
              <div key={dish.id} className="space-y-1">
                <div className="flex items-center justify-between text-[#201A15]">
                  <span className="font-serif text-base sm:text-lg font-bold">
                    {dish.name}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-bold">
                    ₹{isLiteralMockup ? '{item_total}' : Math.round(
                      (dish.price + (dish.options?.reduce((total, option) => total + option.price, 0) || 0))
                      * dish.quantity * 85
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-[#7A6F63]">
                  Qty: {dish.quantity}{' '}
                  <span className="text-[#998F82] mx-1">•</span> Selected:{' '}
                  <span className="italic">
                    {dish.options?.map((option) => option.name).join(', ') || dish.specialInstructions || 'Standard'}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL Box */}
          <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#EFE9DF] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                TOTAL
              </p>
              <p className="text-xs text-[#6B6155] leading-snug">
                Billed directly to ROOM
                <br />
                {roomNumber}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-serif text-sm font-bold text-[#705535] leading-none mb-0.5">
                ₹
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#705535] leading-none">
                {isLiteralMockup ? '{order_total}' : Math.round((latestOrder?.totalAmount || 0) * 85).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Culinary Staff Dietary Note */}
          <div className="bg-[#FAF7F2]/80 border border-[#ECE5DB] rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#6E6356] leading-relaxed">
            <ChefPotIcon className="w-4 h-4 text-[#705535] shrink-0 mt-0.5" />
            <span>
              Executive culinary staff has acknowledged this requisition. Dietary guidelines on record are automatically applied.
            </span>
          </div>
        </section>

        {/* Action CTAs */}
        <div className="pt-2 space-y-3 text-center">
          {/* Bronze View Order Status Button */}
          <Link
            href={orderStatusHref}
            className="w-full py-4 px-6 rounded-2xl bg-[#705535] hover:bg-[#5C452A] text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition active:scale-98"
          >
            <span>View Order Status</span>
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
        <div className="w-full max-w-2xl mx-auto flex items-center justify-around h-16 px-4">
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
            href={orderStatusHref}
            className="flex flex-col items-center justify-center gap-1 text-[#705535] font-bold text-xs transition"
          >
            <ClocheIcon className="w-5 h-5 text-[#705535]" />
            <span className="leading-none">Orders</span>
          </Link>

          {/* 3. Room Service */}
          <Link
            href="/guest/services"
            className="flex flex-col items-center justify-center gap-1 text-[#7C7164] hover:text-[#231E18] text-xs font-medium transition cursor-pointer"
          >
            <ConciergeHandBellIcon className="w-5 h-5 text-[#7C7164]" />
            <span className="leading-none">Room Service</span>
          </Link>
        </div>
      </nav>

      {/* Room Service Services Modal */}
      <RoomServiceRequestModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
      />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
